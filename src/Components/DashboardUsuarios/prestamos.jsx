import React, {useState, useEffect,useRef} from 'react'
import Navbar from './sidebarus'
import {Button,Box,TextField,Typography,Table,TableContainer,TableHead,TableRow,TableCell,TableBody,Paper,TablePagination, TableSortLabel,Dialog, DialogActions, DialogContent, DialogTitle, Popover} from "@mui/material";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';



const columns = [
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id : "descripcion", label: "Descripcion"}
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
        const payload = {
          id_usuario: id_usuario, 
          id_equipo: selectedRow.id_equipo, 
          serial: selectedRow.serial,
          fecha_devolucion: reservationDate.format('YYYY-MM-DD'), 
          
        };
    
        const response = await axios.post("http://localhost:3001/api/prestamos", payload);
    
        if (response.status === 201) {
          toast.success("Prestamo realizado con éxito!",{autoClose:2000});
          handleClose(); 
          fetchData();
        }
      } catch (error) {
        console.error("Error al registrar el préstamo:", error);
        toast.success("Error al reservar prestamo",{autoClose:2000});
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
        <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: '100%', border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  sx={{ fontWeight: 'bold', padding: '8px 10px', borderBottom: '2px solid #ddd' }}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow 
                key={row.id_equipo} 
                sx={{ '&:hover': { backgroundColor: '#e0f7fa' }, height: '50px' }} 
                onMouseEnter={() => setHoveredRow(row.id_equipo)} onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    sx={{ borderBottom: '1px solid #ddd', padding: '8px 10px' }} 
                  >
                    {row[column.id]}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: 'right', width: '150px', overflow: 'hidden', padding: '8px 10px' }}>
                  {hoveredRow === row.id_equipo && (
                    <Button 
                      variant="contained" 
                      sx={{ padding: '5px 10px', minWidth: '80px', backgroundColor: "#d01c35"}}  onClick={() => handleOpen(row)}>
                      Reservar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            <Dialog  open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{'& .MuiDialog-paper': {width: '20%', maxWidth: 'none', padding: '24px',borderRadius: '8px'}}}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Reservar equipo
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column',padding: '20px' }}>
              {selectedRow && (
                <Box sx={{ width: '100%', mb: 3,display:'flex',alignItems:'flex-start',flexDirection: 'column', }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Detalles del equipo:</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px'}}><strong>Nombre:</strong> {selectedRow.nombre_equipo}</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px' }}><strong>Tipo:</strong>: {selectedRow.tipo}</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px' }}><strong>Marca:</strong> {selectedRow.marca}</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px' }}><strong>Modelo:</strong> {selectedRow.modelo}</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px' }}><strong>Descripcion:</strong> {selectedRow.descripcion}</Typography>
                  <Typography  sx={{ fontSize: '16px', marginBottom: '8px' , fontWeight:'bold'}}>Imagen del equipo: </Typography>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 2 }}>
                    <a href={selectedRow.imagen || 'default-image.jpg'} target="_blank" rel="noopener noreferrer">
                      <img
                        src={selectedRow.imagen || 'default-image.jpg'}
                        alt="Equipo"
                        style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                          cursor: 'pointer', 
                        }}
                      />
                    </a>
                    </Box>
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
                      
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
              <Button onClick={handleClose}  sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' }}} variant="outlined">
                Cancelar
              </Button>
              <Button onClick={handleConfirmar} sx={{ backgroundColor: "#d01c35" }} variant="contained">
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
      <Popover
        id={idPopover}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top', 
        }}
        transformOrigin={{
          vertical: 'bottom', 
          horizontal: 'center',
        }}
      >
        {popoverData && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Detalles del equipo</Typography>
            <Typography>Nombre: {popoverData.nombre_equipo}</Typography>
            <img 
              src={popoverData.imagen || 'default-image.jpg'} 
              alt="Equipo" 
              style={{ width: '100px', height: 'auto' }} 
            />
            <Typography>{popoverData.descripcion}</Typography>
          </Box>
        )}
      </Popover>
      <ToastContainer />
    </Box>
  );
}

export default Prestamos;