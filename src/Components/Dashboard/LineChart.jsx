import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';

dayjs.locale('es');

const BarChartComponent = () => {
  const [data, setData] = useState([]);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/equipos/utilizadoslinea");
      const formattedData = response.data.map(item => ({
        fecha: dayjs(item.fecha),
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

  // Función para obtener los días de la semana en formato abreviado hasta el día de hoy
  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs();

    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek.add(i, 'day');
      if (currentDay.isAfter(endOfWeek)) {
        break;
      }
      days.push(currentDay.format('ddd'));
    }
    return days;
  };

  // Función para organizar los datos según los días de la semana, hasta el día de hoy
  const getWeeklyData = () => {
    const daysOfWeek = getDaysOfWeek();
    const weeklyData = daysOfWeek.map(day => {
      const dayData = data.filter(item => item.fecha.format('ddd') === day);
      const totalAmount = dayData.reduce((sum, item) => sum + item.cantidad, 0);
      return {
        fecha: day,
        cantidad: totalAmount
      };
    });

    return weeklyData;
  };

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '50px' }}>
        <Paper elevation={6} sx={{ padding: 3, width: '720px', height: '500px', borderRadius: '16px', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)' ,ml:2}}>
          <Typography variant="h6" align="center" gutterBottom>
            Última semana (Hasta hoy)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getWeeklyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" label={{ value: "Día", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Cantidad de Préstamos", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="subtitle1" align="center" mt={2}>
            Promedio esta semana: {Math.round(data.reduce((sum, item) => sum + item.cantidad, 0) / data.length) || 0}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default BarChartComponent;
