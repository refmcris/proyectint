import React, { useState, useEffect } from "react";
import { Button, Box, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, TableSortLabel, Grid } from "@mui/material";
import axios from "axios";
import SideBar from './sidebar';

const initialData = [];

const columns = [
  { id: "nombre", label: "Nombre" },
  { id: "apellido", label: "Apellido" },
  { id: "tipo_documento", label: "Tipo Doc" },
  { id: "documento", label: "Documento" },
  { id: "correo_electronico", label: "Correo" },
  { id: "telefono", label: "Teléfono" },
  { id: "rol", label: "Rol" },
];

function Usuarios() {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/usuarios"); 
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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

  const sortedData = data
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postData = { ...editRecord };
    const url = "http://localhost:3001/api/usuarios"; 

    try {
      if (editMode) {
        await axios.put(`${url}/${editRecord.id}`, postData); 
        alert("Registro actualizado con éxito");
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editRecord.id ? postData : item
          )
        );
      } else {
        await axios.post(url, postData);
        alert("Registro agregado con éxito");
        setData((prevData) => [...prevData, postData]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar registro", error);
      alert("Error al guardar registro");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center",  mb: 2,
          }}
        >
          <Button variant="contained" onClick={handleOpenModal} sx={{ backgroundColor: "#d01c35" }}>
            Agregar Registro
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} onClick={() => handleSort(column.id)} >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="outlined"  onClick={() => handleEditRecord(row)} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': {  borderColor: '#f56c6c', backgroundColor: '#fbe8e8', },
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={data.length}  rowsPerPage={rowsPerPage}  page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
          <Box
            sx={{
              width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' },
              bgcolor: 'background.paper',
              p: { xs: 2, sm: 3, md: 4 },
              mx: 'auto',
              mt: { xs: '20%', sm: '15%', md: '10%' },
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" id="modal-title" gutterBottom>
              {editMode ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField name="nombre" label="Nombre" value={editRecord.nombre || ""} onChange={handleInputChange} fullWidth  sx={{ mb: 2 }}
              />
              <TextField  name="apellido" label="Apellido" value={editRecord.apellido || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tipo-documento-label">Tipo Documento</InputLabel>
                <Select labelId="tipo-documento-label" name="tipo_documento" value={editRecord.tipo_documento || ""} onChange={handleInputChange} label="Tipo Documento">
                  <MenuItem value="DNI">DNI</MenuItem>
                  <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
              <TextField name="documento" label="Documento" value={editRecord.documento || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
              />
              <TextField name="correo_electronico" label="Correo Electrónico" value={editRecord.correo_electronico || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
              />
              <TextField name="telefono" label="Teléfono" value={editRecord.telefono || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
              />
              <TextField name="rol" label="Rol" value={editRecord.rol || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#d01c35" }}>
                  {editMode ? "Guardar Cambios" : "Agregar Usuario"}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default Usuarios;
