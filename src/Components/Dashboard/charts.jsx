import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton,Tooltip, } from '@mui/material';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import SideBar from './sidebar';
import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Charts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/equipos/utilizados');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = Array.isArray(data) ? data.map(item => ({
    id: item.nombre_equipo,
    value: item.cantidad,
  })) : [];
 const exportToExcel = () => {
    const modifiedData = chartData.map(item => ({
        'Nombre del Equipo': item.id,
        'Cantidad de Préstamos': item.value,
      }));
    const worksheet = XLSX.utils.json_to_sheet(modifiedData); 
    worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 }, 
      ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos Prestados'); 
    XLSX.writeFile(workbook, 'equipos_prestados.xlsx'); 
  };
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF5733', '#C70039', '#900C3F'];

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <SideBar />


      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '30px' }}>
        <Paper elevation={6} sx={{ padding: 3, width: '700px', borderRadius: '16px', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' }}>
        <Tooltip title="Exportar a excel">
          <IconButton onClick={exportToExcel}   sx={{backgroundColor: '#2e7d32','&:hover': {backgroundColor: '#1b5e20',}}}>
            <InsertDriveFileIcon sx={{ color: '#eef5f1' }}/>
          </IconButton>
        </Tooltip>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Equipos más usados</Typography>
          {loading ? (
            <Typography variant="h6" align="center">Cargando datos...</Typography>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="id"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
              
            </ResponsiveContainer>

          ) : (
            <Typography variant="h6" align="center">No hay datos disponibles.</Typography>
          )}
          
        </Paper>
      </Box>


      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '50px', marginLeft: '50px' }}>
        <Paper elevation={6} sx={{ padding: 3, width: '750px', borderRadius: '16px', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' }}>
            <Tooltip title="Exportar a excel">
            <IconButton onClick={exportToExcel}   sx={{backgroundColor: '#2e7d32','&:hover': {backgroundColor: '#1b5e20',}}}>
                <InsertDriveFileIcon sx={{ color: '#eef5f1' }}/>
            </IconButton>
            </Tooltip>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Equipos más usados</Typography>
          {loading ? (
            <Typography variant="h6" align="center">Cargando datos...</Typography>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#36A2EB" barSize={40} radius={[10, 10, 0, 0]}  name="Cantidad de Préstamos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="h6" align="center">No hay datos disponibles.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Charts;
