import React, { useEffect, useState,  } from "react";
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, TableSortLabel,  Tooltip, IconButton, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import axios from "axios";
import SideBar from './sidebar';
import { exportExcel } from "../../Common/exportExcel";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

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
  const [filteredData, setFilteredData] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchData = async () => {
    try {
      const response = await axios.get("https://uniback.onrender.com/api/usuarios"); 
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleExport = () => {
    const cols = [
      { header: "Nombre", key: "nombre", width: 15 },
      { header: "Apellido", key: "apellido", width: 30 },
      { header: "Tipo Documento", key: "tipo_documento", width: 20 },
      { header: "Documento", key: "documento", width: 20 },
      { header: "Correo", key: "correo_electronico", width: 20 },
      { header: "Telefono", key: "telefono", width: 20 },
      { header: "Rol", key: "rol", width: 20 },
    ];

    exportExcel({
      cols,
      data,
      sheetName: "Usuarios",
      creator: "Uninventory", 
      handleLoading: (loadingState) => {

      },
    });
  };


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

  const sortedData = filteredData
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
    const url = "https://uniback.onrender.com/api/usuarios"; 

    try {
      if (editMode) {
        await axios.put(`${url}/${editRecord.id_usuario}`, postData);
        toast.success("Registro actualizado con éxito!",{autoClose:2000});
        fetchData();
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editRecord.id ? postData : item
          )
        );
      } else {
        await axios.post(url, postData);
        toast.success("Registro agregado con éxito!",{autoClose:2000});
        fetchData();
        setData((prevData) => [...prevData, postData]);
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Error al guardar registro!",{autoClose:2000});
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = data.filter((item) =>
      columns.some((column) => item[column.id].toLowerCase().includes(event.target.value.toLowerCase()))
    );
    setFilteredData(filtered);
    setPage(0); // Metodo buscar
  };
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
      <Typography variant="h4" sx={{ marginBottom: 2, color: '#333' }}>
          Información de usuarios
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}} >
          
          <TextField
            label="Buscar Usuarios"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3, width: '300px' }}
          />
          {/* <Button variant="contained" onClick={handleOpenModal} sx={{ backgroundColor: "#d01c35" }}>
            Agregar Registro
          </Button> */}
        </Box>
        <Box sx ={{display:"flex",justifyContent:"flex-end"}}>
            <Tooltip title="Exportar a excel">
                <IconButton onClick={handleExport}   sx={{backgroundColor: '#2e7d32','&:hover': {backgroundColor: '#1b5e20',}}}>
                  <InsertDriveFileIcon sx={{ color: '#eef5f1' }}/>
                </IconButton>
            </Tooltip>

        </Box>
        <TableContainer component={Paper} sx={{borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'}}>
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
                      }}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={data.length}  rowsPerPage={rowsPerPage}  page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>
            {editMode ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                name="nombre"
                label="Nombre"
                value={editRecord.nombre || ""}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="apellido"
                label="Apellido"
                value={editRecord.apellido || ""}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tipo-documento-label">Tipo Documento</InputLabel>
                <Select
                  labelId="tipo-documento-label"
                  name="tipo_documento"
                  value={editRecord.tipo_documento || ""}
                  onChange={handleInputChange}
                  label="Tipo Documento"
                >
                  <MenuItem value="CC">CC</MenuItem>
                  <MenuItem value="T.I">T.I</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="documento"
                label="Documento"
                value={editRecord.documento || ""}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="correo_electronico"
                label="Correo Electrónico"
                value={editRecord.correo_electronico || ""}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="telefono"
                label="Teléfono"
                value={editRecord.telefono || ""}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={editRecord.rol || ""}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="estudiante">Estudiante</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
              <Button onClick={handleCloseModal} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' },marginRight:2 }}variant="outlined">Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#d01c35" }} onClick={handleSubmit}>{editMode ? "Guardar Cambios" : "Agregar Usuario"} </Button>
            </Box>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default Usuarios;
