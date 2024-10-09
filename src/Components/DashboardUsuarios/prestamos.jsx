import React, {useState, useEffect,useRef} from 'react'
import Navbar from './sidebarus'
import {Button,Box,TextField,Typography,Table,TableContainer,TableHead,TableRow,TableCell,TableBody,Paper,TablePagination, TableSortLabel
,Dialog, DialogActions, DialogContent,
DialogTitle} from "@mui/material";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';



const columns = [
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
];
function Prestamos() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderBy, setOrderBy] = useState("id_equipo");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [reservationDate, setReservationDate] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState('');
  const today = dayjs();
  const maxDate = today.add(7, 'day');

 

  const id_usuario = Cookies.get('id_usuario') || '';
  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const handleDateChange = (newDate) => {
    setReservationDate(newDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/equipos");
        const availableData = response.data.filter(item => item.estado === "disponible");
        setData(availableData);
        setFilteredData(availableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = filteredData
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
    const handleConfirmar = async () => {
      try {
        const payload = {
          id_usuario: id_usuario, 
          id_equipo: selectedRow.id_equipo, 
          serial: selectedRow.serial,
          fecha_devolucion: reservationDate.format('YYYY-MM-DD'), 
          
        };
    
        const response = await axios.post("http://localhost:3001/api/prestamos", payload);
    
        if (response.status === 201) {
          alert('Préstamo registrado con éxito');
          handleClose(); 
        }
      } catch (error) {
        console.error("Error al registrar el préstamo:", error);
        alert("Hubo un error al registrar el préstamo");
      }
    };
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      const filtered = data.filter((item) =>
        columns.some((column) => item[column.id].toLowerCase().includes(event.target.value.toLowerCase()))
      );
      setFilteredData(filtered);
      setPage(0);
    };
   
  return (
    <Box sx={{}}>

      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "100px" }}>
      <Typography variant="h4" gutterBottom>
          Lista de Equipos
        </Typography>
        <TextField
          label="Buscar equipos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3, width: '300px' }}
        />
        <TableContainer component={Paper} sx={{borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: '100%', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{fontWeight: 'bold' , padding: '20px',borderBottom: '2px solid #ddd'}}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id_equipo} sx={{ '&:hover': { backgroundColor: '#e0f7fa' } }}  onMouseEnter={() => setHoveredRow(row.id_equipo)} onMouseLeave={() => setHoveredRow(null)} >
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{borderBottom: '1px solid #ddd'}}>{row[column.id]}</TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'right', width: '150px', overflow: 'hidden' }}>
                    {hoveredRow === row.id_equipo && (
                      <Button variant="contained" color="primary" sx={{ padding: '5px 10px', minWidth: '80px' }} onClick={() => handleOpen(row)}>
                        Reservar
                      </Button>
                    )}
                  </TableCell>
                  

                </TableRow>
              ))}
            </TableBody>
            <Dialog  open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{'& .MuiDialog-paper': {width: '20%', maxWidth: 'none', padding: '24px'}}}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Reservar equipo
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              {selectedRow && (
                <Box sx={{ width: '100%', mb: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Detalles del equipo:</Typography>
                  <Typography>Nombre: {selectedRow.nombre_equipo}</Typography>
                  <Typography>Tipo: {selectedRow.tipo}</Typography>
                  <Typography>Marca: {selectedRow.marca}</Typography>
                  <Typography>Modelo: {selectedRow.modelo}</Typography>
                </Box>
              )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de reserva"
                  value={reservationDate}
                  onChange={handleDateChange}
                  minDate={today}
                  maxDate={maxDate}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" sx={{ maxWidth: '400px' }} />}
                />
              </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
              <Button onClick={handleClose} color="primary" variant="outlined">
                Cancelar
              </Button>
              <Button onClick={handleConfirmar} color="primary" variant="contained">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5,10, 15, 30]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}

export default Prestamos;