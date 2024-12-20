import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,Box,Modal,TextField,FormControl,InputLabel,Select,MenuItem,Typography,Table,TableContainer,TableHead,TableRow,TableCell, TableBody,Paper,TablePagination,TableSortLabel, Grid, IconButton, Tooltip, DialogTitle, Dialog, DialogContent, DialogActions} from "@mui/material";
import SideBar from "./sidebar";
import { exportExcel } from "../../Common/exportExcel";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import BuildIcon from '@mui/icons-material/Build';
import ErrorIcon from '@mui/icons-material/Error';





const columns = [
  { id: "nombre_usuario", label: "Nombre Usuario" },
  { id: "apellido_usuario", label: "Apellido Usuario" },
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "serial", label: "Serial" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "estado_prestamo", label: "Estado del Préstamo" },
  { id: "fecha_prestamo", label: "Fecha de Préstamo" },
  { id: "fecha_devolucion", label: "Fecha de Devolución" },
];
function Externos() {
    const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre_usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');


  const handleExport = () => {
    const cols = [
      { header: "Nombre usuario", key: "nombre_usuario", width: 30 },
      { header: "Apellido", key: "apellido_usuario", width: 15 },
      { header: "Nombre equipo", key: "nombre_equipo", width: 20 },
      { header: "Serial", key: "serial", width: 20 },
      { header: "Tipo", key: "tipo", width: 20 },
      { header: "Marca", key: "marca", width: 20 },
      { header: "Modelo", key: "modelo", width: 20 },
      { header: "Estado", key: "estado_prestamo", width: 20 },
      { header: "Fecha de prestamo", key: "fecha_prestamo", width: 20 },
      { header: "Fecha de devolucion", key: "fecha_devolucion", width: 20 },
    ];

    exportExcel({
      cols,
      data,
      sheetName: "Prestamos-externos",
      creator: "Uninventory", 
      handleLoading: (loadingState) => {

      },
    });
  };




  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/prestamos-equipos");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditMode(false);
    setEditRecord({});
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditRecord({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRecord({ ...editRecord, [name]: value });
  };

  const handleEditRecord = (record) => {
    setEditMode(true);
    setEditRecord(record);
    setOpenModal(true);
  };

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
  const handleSaveChanges = async () => {
    try {
        const response = await axios.put(`http://localhost:3001/api/prestamos-equipos/${editRecord.id_prestamo}`, {
          estado: editRecord.estado 
        });
  
      if (response.status === 200) {
        toast.success("Prestamo actualizado con éxito!",{autoClose:2000});
        handleCloseModal();
        fetchData();
      }
    } catch (error) {
      console.error("Error actualizando el préstamo:", error);
    }
  };

  const sortedData = filteredData
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort((a, b) => {
      if (orderBy === "fecha_prestamo") {
        return new Date(a[orderBy]) - new Date(b[orderBy]);
      }
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    const getEstadoIconAndColor = (estado_prestamo) => {
      switch (estado_prestamo) {
        case "devuelto":
          return {  icon: <CheckCircleIcon sx={{ color: "#3df27b", verticalAlign: 'middle' }} /> }; 
        case "en préstamo":
          return {  icon: <HourglassFullIcon sx={{ color: "#feac54", verticalAlign: 'middle' }} /> }; 
        case "en reparación":
          return {  icon: <BuildIcon sx={{ color: "#f8646d", verticalAlign: 'middle' }} /> };
        case "retrasado":
          return { icon: <ErrorIcon sx={{ color: "#f56c6c", verticalAlign: 'middle' }} /> };
        default:
          return { color: "black", icon: null };
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
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 1, marginTop: "0px"}}>
        <Box sx={{ display: "flex",justifyContent: "space-between", alignItems: "center"}}>
        <TextField
          label="Buscar Préstamos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 1, width: '300px' }}
        />
        <Tooltip title="Exportar a excel">
          <IconButton onClick={handleExport}   sx={{backgroundColor: '#2e7d32','&:hover': {backgroundColor: '#1b5e20',}}}>
            <InsertDriveFileIcon sx={{ color: '#eef5f1' }}/>
          </IconButton>
        </Tooltip>
        

        </Box>
      
        <TableContainer component={Paper}sx={{borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'}}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id_equipo}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.id === "estado_prestamo" ? (
                        <Tooltip title={row[column.id]}>
                          <span
                            style={{
                              backgroundColor: getEstadoIconAndColor(row[column.id]).color,
                              padding: "5px 10px",
                              borderRadius: "5px",
                              display: "inline-block"
                            }}
                          >
                            {getEstadoIconAndColor(row[column.id]).icon}
                          </span>
                        </Tooltip>
                    ) : column.id === "fecha_prestamo" || column.id === "fecha_devolucion" ? (
                      new Date(row[column.id]).toLocaleString()
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditRecord(row)}  
                    sx={{color: "#f56c6c",borderColor: "#f56c6c","&:hover": {borderColor: "#f56c6c",backgroundColor: "#fbe8e8",},
                    }} >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle id="modal-title">
          {editMode ? "Editar Préstamo" : "Ver Registro"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "background.paper", p: { xs: 2, sm: 3, md: 4 } }}>
            <form>
              <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado-select"
                  name="estado"
                  value={editRecord.estado || ""}
                  onChange={handleInputChange}
                  label="Estado"
                >
                  <MenuItem value="devuelto">Devuelto</MenuItem>
                  <MenuItem value="en préstamo">En préstamo</MenuItem>
                  <MenuItem value="en reparación">Necesita reparación</MenuItem>
                </Select>
              </FormControl>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{display:"flex",justifyContent:"center", width: '100%'}}>
            <Button variant="outlined"  sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8'},marginRight:2}} onClick={handleCloseModal}>  Cancelar </Button>
            <Button variant="contained" sx={{ backgroundColor: "#d01c35" }} onClick={handleSaveChanges}> Guardar Cambios </Button>
          </Box>
              
          
        </DialogActions>
      </Dialog>
      <ToastContainer />
      </Box>
    </Box>
  );
  
}

export default Externos