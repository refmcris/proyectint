import React, { useState, useEffect, useRef } from 'react';
import Navbar from './sidebarus';
import { 
  Button, Box, TextField, Typography, 
  Table, TableContainer, TableHead, TableRow, 
  TableCell, TableBody, Paper, TablePagination, 
  TableSortLabel, Dialog, DialogActions, DialogContent, 
  DialogTitle, Popover 
} from "@mui/material";
import axios from "axios";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Columnas de la tabla
const columns = [
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id : "descripcion", label: "Descripcion" }
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
  const [anchorEl, setAnchorEl] = useState(null); 
  const [popoverData, setPopoverData] = useState(null);
  const [reservationTime, setReservationTime] = useState(dayjs()); 

  const handleTimeChange = (newTime) => {
    setReservationTime(newTime); 
  };

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

  useEffect(() => {
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
      const fechaHoraDevolucion = reservationDate
        .hour(reservationTime.hour())
        .minute(reservationTime.minute());

      const payload = {
        id_usuario: id_usuario, 
        id_equipo: selectedRow.id_equipo, 
        serial: selectedRow.serial,
        fecha_devolucion: fechaHoraDevolucion.format('YYYY-MM-DD HH:mm')
      };

      const response = await axios.post("http://localhost:3001/api/prestamos", payload);

      if (response.status === 201) {
        toast.success("Prestamo realizado con éxito!", { autoClose: 2000 });
        handleClose(); 
        fetchData();
      }
    } catch (error) {
      console.error("Error al registrar el préstamo:", error);
      toast.error("Error al reservar préstamo", { autoClose: 2000 });
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

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget); 
    setPopoverData(row); 
    setHoveredRow(row.id_equipo);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null); 
    setPopoverData(null);
  };

  const openPopover = Boolean(anchorEl); 

  const idPopover = openPopover ? 'simple-popover' : undefined;

  return (
    <Box sx={{}}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "100px" }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          Lista de Equipos
        </Typography>
        <TextField
          label="Buscar equipos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3, width: '300px' }}
        />
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)', maxWidth: '1800px', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    sx={{ fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ width: '150px', padding: '10px' }}></TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow 
                  key={row.id_equipo} 
                  sx={{ '&:hover': { backgroundColor: '#e0f7fa' }, height: '50px' }} 
                  onMouseEnter={() => setHoveredRow(row.id_equipo)} 
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ padding: '8px 10px' }}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'right', padding: '8px 10px' }}>
                    {hoveredRow === row.id_equipo && (
                      <Button 
                        variant="contained" 
                        sx={{ padding: '5px 10px', backgroundColor: "#d01c35" }} 
                        onClick={() => handleOpen(row)}
                      >
                        Reservar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: '16px' }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Préstamo</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Reserva"
              value={reservationDate}
              onChange={handleDateChange}
              minDate={today}
              maxDate={maxDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Hora de Reserva"
              value={reservationTime}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmar} color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Popover
        id={idPopover}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          {popoverData && (
            <Typography variant="body2" sx={{ color: '#555' }}>
              <strong>Serial: </strong>{popoverData.serial}<br />
              <strong>Marca: </strong>{popoverData.marca}
            </Typography>
          )}
        </Box>
      </Popover>

      <ToastContainer />
    </Box>
  );
}

export default Prestamos;
