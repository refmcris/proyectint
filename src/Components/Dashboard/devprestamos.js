import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,Box,Modal,TextField,FormControl,InputLabel,Select,MenuItem,Typography,Table,TableContainer,TableHead,TableRow,TableCell, TableBody,Paper,TablePagination,TableSortLabel, Grid} from "@mui/material";
import SideBar from "./sidebar";




const initialData = [];

const columns = [
  { id: "nombre_usuario", label: "Nombre Usuario" },
  { id: "apellido_usuario", label: "Apellido Usuario" },
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "estado_prestamo", label: "Estado del Préstamo" },
  { id: "fecha_prestamo", label: "Fecha de Préstamo" },
  { id: "fecha_devolucion", label: "Fecha de Devolución" },
];
function Devprestamos() {
    const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre_usuario");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/prestamos-equipos");
      setData(response.data);
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
        alert("Préstamo actualizado correctamente");
        handleCloseModal();
        fetchData();
      }
    } catch (error) {
      console.error("Error actualizando el préstamo:", error);
    }
  };

  const sortedData = data
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
        case 'pendiente':
          return '#feac54';
        case 'devuelto':
          return '#3df27b';
      }
    }
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ display: "flex",justifyContent: "flex-end", alignItems: "center", mb: 2,}}>
          <Button variant="contained"onClick={handleOpenModal}sx={{ backgroundColor: "#d01c35" }}>
            Agregar Registro
          </Button>
        </Box>
        <TableContainer component={Paper}>
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
            <form>
            <FormControl sx={{ mb: 2 }} fullWidth>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select labelId="estado-label" id="estado-select" name="estado" value={editRecord.estado || ""} onChange={handleInputChange}label="Estado">
                <MenuItem value="devuelto">Devuelto</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={2}>
                <Grid item>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                </Grid>
                <Grid item>
                <Button variant="contained" sx={{ backgroundColor: "#d01c35" }} onClick={handleSaveChanges}  >
                    Guardar Cambios
                </Button>
                </Grid>
            </Grid>
            </form>
        </Box>
        </Modal>

      </Box>
    </Box>
  );
  
}

export default Devprestamos