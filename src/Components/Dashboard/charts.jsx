import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Popover } from '@mui/material';
import { DateRange } from 'react-date-range';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Charts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [anchorEl, setAnchorEl] = useState(null); // State for Popover anchor
  const API_URL = 'http://localhost:3001/api/equipos/utilizados';

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchData(dateRange);
    }
  }, [dateRange]);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}?start=${dayjs(range.startDate).toISOString()}&end=${dayjs(range.endDate).toISOString()}`
      );
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

  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleDateClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl); // Determines if Popover is open
  const id = open ? 'date-range-popover' : undefined;

  const filteredData = Array.isArray(data)
    ? data
        .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
        .map(item => ({ id: item.nombre_equipo, value: item.cantidad }))
    : [];

  const exportToExcel = () => {
    const modifiedData = filteredData.map(item => ({
      'Nombre del Equipo': item.id,
      'Cantidad de Préstamos': item.value,
    }));
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos Prestados');
    XLSX.writeFile(workbook, 'equipos_prestados.xlsx');
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF5733', '#C70039', '#900C3F'];

  const renderChart = () => {
 
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="id"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
              isAnimationActive={true}
              animationDuration={800}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      );
  };

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '50px' }}>
        <Paper elevation={6} sx={{ padding: 3, width: '650px', height: '500px', borderRadius: '16px', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' }}>
          <Tooltip title="Exportar a Excel">
            <IconButton onClick={exportToExcel} sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}>
              <InsertDriveFileIcon sx={{ color: '#eef5f1' }} />
            </IconButton>
          </Tooltip>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Equipos más usados</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>


            {/* Date Range Picker Button */}
            <Button onClick={handleDateClick} variant="outlined">
              Seleccionar Rango de Fecha
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleDateClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <DateRange
                ranges={[dateRange]}
                onChange={(ranges) => setDateRange(ranges.selection)}
              />
            </Popover>

          </Box>

          {loading ? (
            <Typography variant="h6" align="center">Cargando datos...</Typography>
          ) : filteredData.length > 0 ? (
            renderChart()
          ) : (
            <Typography variant="h6" align="center">No hay datos disponibles.</Typography>
          )}
{/* 
          <Button onClick={() => fetchData(dateRange)} sx={{ marginTop: 2 }} variant="contained" color="primary">
            Actualizar Datos
          </Button> */}
        </Paper>
      </Box>
    </Box>
  );
};

export default Charts;
