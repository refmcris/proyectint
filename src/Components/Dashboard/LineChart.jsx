import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Box, Typography, Popover } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from 'react-date-range';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css'; // estilos principales
import 'react-date-range/dist/theme/default.css'; // estilos del tema

dayjs.locale('es');

const BarChartComponent = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState([
    {
      startDate: new Date(dayjs().startOf('week').format()), // Inicio de la semana actual
      endDate: new Date(dayjs().endOf('week').format()), // Fin de la semana actual
      key: 'selection',
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    
    try {
      const response = await axios.get("https://uniback.onrender.com/api/equipos/utilizadoslinea", {
        params: {
          startDate: dayjs(range[0].startDate).format('YYYY-MM-DD'),
          endDate: dayjs(range[0].endDate).format('YYYY-MM-DD'),
          
        },
      });
      
      const formattedData = response.data.map(item => ({
        fecha: dayjs(item.fecha),
        cantidad: item.cantidad,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la API con el rango actualizado
  }, [range]);

  // Función para filtrar los datos según el rango seleccionado
  const getFilteredData = () => {
    const start = dayjs(range[0].startDate);
    const end = dayjs(range[0].endDate);

    const filteredData = data.filter(item =>
      item.fecha.isBetween(start, end, null, '[]')
    );

    const daysInRange = [];
    for (let i = 0; i <= end.diff(start, 'day'); i++) {
      daysInRange.push(start.add(i, 'day').format('ddd'));
    }

    const weeklyData = daysInRange.map(day => {
      const dayData = filteredData.filter(item => item.fecha.format('ddd') === day);
      const totalAmount = dayData.reduce((sum, item) => sum + item.cantidad, 0);
      return {
        fecha: day,
        cantidad: totalAmount,
      };
    });

    return weeklyData;
  };

  // Manejadores para el Popover
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  // Validar rango de fechas (máximo 7 días)
  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;

    const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1; // Incluye ambos días
    if (diffInDays <= 7) {
      setRange([item.selection]);
    } else {
      alert('Solo puedes seleccionar un rango de máximo 7 días.');
    }
  };

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '50px' }}>
        <Paper
          elevation={6}
          sx={{
            padding: 3,
            width: '720px',
            height: 'auto',
            borderRadius: '16px',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            ml: 2,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Datos por rango de fechas
          </Typography>

          {/* Etiquetas de rango de fechas */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
              cursor: 'pointer',
            }}
            onClick={handleOpenPopover}
          >
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              <strong>Desde:</strong> {dayjs(range[0].startDate).format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body1">
              <strong>Hasta:</strong> {dayjs(range[0].endDate).format('DD/MM/YYYY')}
            </Typography>
          </Box>

          {/* Popover para el selector de rango de fechas */}
          <Popover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ padding: 2 }}>
              <DateRange
                ranges={range}
                onChange={handleDateChange}
                rangeColors={['#8884d8']}
                maxDate={new Date()} // No permite seleccionar fechas futuras
              />
            </Box>
          </Popover>

          {/* Gráfico */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" label={{ value: "Día", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Cantidad de Préstamos", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>

          {/* Promedio */}
          <Typography variant="subtitle1" align="center" mt={2}>
            Promedio en el rango seleccionado: {Math.round(getFilteredData().reduce((sum, item) => sum + item.cantidad, 0) / getFilteredData().length) || 0}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default BarChartComponent;
