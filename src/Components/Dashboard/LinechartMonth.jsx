import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import Charts from './charts';
import LineChartComponent from './LineChart';

dayjs.locale('es');

const LineChartMonth = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://uniback.onrender.com/api/equipos/utilizadoslineamonth");
      const formattedData = response.data.map(item => ({
        // Convierte la fecha de string a un objeto dayjs
        fecha: dayjs(item.mes, 'YYYY-MM'), // Especifica el formato de la fecha
        cantidad: item.cantidad
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para organizar los datos según los meses
  const getMonthlyData = () => {
    const monthsMap = Array.from({ length: 12 }, (_, i) => ({
      fecha: dayjs().month(i).format('MMMM'), // Nombre completo del mes
      cantidad: 0
    }));

    data.forEach(item => {
      const monthIndex = item.fecha.month(); // Índice del mes (0 = Enero, 11 = Diciembre)
      monthsMap[monthIndex].cantidad += item.cantidad;
    });

    return monthsMap;
  };

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100vh', padding: '15px' }}>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',gap:6}}>
          <LineChartComponent/>
          <Charts/>
        </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ width: '1570px',  height:'500px', borderRadius: '16px', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)'}}>
          <Typography variant="h6" align="center" gutterBottom>
            Datos Agrupados por Mes
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" label={{ value: "Mes", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Cantidad de Préstamos", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Line type="monotone" dataKey="cantidad" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <Typography variant="subtitle1" align="center" mt={2}>
            Total anual: {Math.round(data.reduce((sum, item) => sum + item.cantidad, 0)) || 0}
          </Typography>
        </Paper>
      </Box>
    </Box>
    </>
    
  );
};

export default LineChartMonth;
