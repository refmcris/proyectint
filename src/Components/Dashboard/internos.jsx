import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,Box,Modal,TextField,FormControl,InputLabel,Select,MenuItem,Typography,Table,TableContainer,TableHead,TableRow,TableCell, TableBody,Paper,TablePagination,TableSortLabel, Grid} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; 
import dayjs from 'dayjs';



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
function Internos() {
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
  const [equipos, setEquipos] = useState([]); 
  const [fechaDevolucion, setFechaDevolucion] = useState(null); 
  const today = dayjs();
  const maxDate = today.add(7, 'day');






  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/prestamos-internos");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchEquipos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/equipos"); 
      setEquipos(response.data);
    } catch (error) {
      console.error("Error fetching equipos:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEquipos(); 
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditMode(false);
    setEditRecord({});
    setFechaDevolucion(null); 
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditRecord({});
    setFechaDevolucion(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRecord({ ...editRecord, [name]: value });
    if (name === "id_equipo") {
      const equipoSeleccionado = equipos.find((equipo) => equipo.id_equipo === value);
      if (equipoSeleccionado) {
        setEditRecord((prevRecord) => ({
          ...prevRecord,
          serial: equipoSeleccionado.serial, 
        }));
      }
    }
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
    if (editMode) {
      try {
       
        const response = await axios.put(`http://localhost:3001/api/prestamos-equipos-internos/${editRecord.id_prestamo}`, {
          estado: editRecord.estado,
        });
        if (response.status === 200) {
          alert("Préstamo actualizado correctamente");
          handleCloseModal();
          fetchData();
        }
      } catch (error) {
        console.error("Error actualizando el préstamo:", error);
      }
    } else {
      try {
        const newPrestamo = {
          id_usuario: editRecord.idestudiante,
          nombre: editRecord.nombre,
          apellido: editRecord.apellido,
          id_equipo: editRecord.id_equipo,
          serial: editRecord.serial,
          fecha_devolucion: fechaDevolucion,
        };

        const response = await axios.post("http://localhost:3001/api/prestamos-externos", newPrestamo);
        if (response.status === 201) {
          alert("Préstamo registrado correctamente");
          handleCloseModal();
          fetchData();
        }
      } catch (error) {
        console.error("Error registrando el préstamo:", error);
      }
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

    function getrowcolor(estado_prestamo){
      
      switch(estado_prestamo){
        case 'en préstamo':
          return '#feac54';
        case 'devuelto':
          return '#3df27b';
        case 'retrasado':
          return '#f56c6c';
      }
    }
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
      <Box component="main" sx={{ flexGrow: 1, p: 1, marginTop: "0px" }}>
        <Box sx={{ display: "flex",justifyContent: "space-between", alignItems: "center"}}>
        <TextField
          label="Buscar Prestamos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 1, width: '300px' }}
        />
          <Button variant="contained"onClick={handleOpenModal}sx={{ backgroundColor: "#d01c35" }}>
            Agregar Registro
          </Button>
          
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
                      <Box sx={{
                          border: `1px solid ${getrowcolor(row.estado_prestamo)}`, 
                          borderRadius: "4px", padding: "4px 8px",display: "inline-block",backgroundColor: getrowcolor(row.estado_prestamo)
                        }}
                      >
                        {row[column.id]} 
                      </Box>
                    ) : column.id === "fecha_prestamo" || column.id === "fecha_devolucion" ? (
                      new Date(row[column.id]).toLocaleDateString()
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
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
        <Box
            sx={{ width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" },bgcolor: "background.paper", p: { xs: 2, sm: 3, md: 4 }, mx: "auto", mt: { xs: "20%", sm: "15%", md: "10%" },borderRadius: 1,
            }}
        >
            <Typography variant="h5" id="modal-title" gutterBottom>
            {editMode ? "Editar Registro" : "Ver Registro"}
            </Typography>
            <Grid container spacing={2}>
            {!editMode && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Código Estudiante"
              name="idestudiante"
              value={editRecord.idestudiante || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="select-equipo-label">ID Equipo</InputLabel>
              <Select
                labelId="select-equipo-label"
                value={editRecord.id_equipo || ""}
                name="id_equipo"
                onChange={handleInputChange}
              >
                {equipos.map((equipo) => (
                  <MenuItem key={equipo.id_equipo} value={equipo.id_equipo}>
                    {equipo.nombre_equipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Serial"
              name="serial"
              value={editRecord.serial || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              value={editRecord.nombre || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Apellido"
              name="apellido"
              value={editRecord.apellido || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Devolución"
                value={fechaDevolucion}
                onChange={(newValue) => setFechaDevolucion(newValue)}
                minDate={today}
                maxDate={maxDate}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" required fullWidth sx={{ mb: 2 }} />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </>
      )}
            {editMode && (
              <Grid item xs={12}>
                <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select labelId="estado-label" id="estado-select" name="estado" value={editRecord.estado || ""} onChange={handleInputChange}label="Estado">
                <MenuItem value="devuelto">Devuelto</MenuItem>
                <MenuItem value="en préstamo">En préstamo</MenuItem>
                <MenuItem value="en reparación">Necesita reparacion</MenuItem>
                </Select>
            </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSaveChanges}>
                {editMode ? "Guardar Cambios" : "Agregar Registro"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      </Box>
    </Box>
  );
  
}

export default Internos