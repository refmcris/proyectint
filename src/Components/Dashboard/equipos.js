  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import {Button,Box,Modal,TextField,FormControl,InputLabel,Select,MenuItem,Typography,Table,TableContainer,TableHead,TableRow,TableCell,TableBody,Paper,TablePagination, TableSortLabel,Grid
  } from "@mui/material";
  import SideBar from "./sidebar";

  const initialData = [];

  const columns = [
    { id: "id_equipo", label: "ID Equipo" },
    { id: "nombre_equipo", label: "Nombre Equipo" },
    { id: "tipo", label: "Tipo" },
    { id: "marca", label: "Marca" },
    { id: "modelo", label: "Modelo" },
    { id: "estado", label: "Estado" },
    { id: "ubicación", label: "Ubicación" },
    { id: "fecha_ingreso", label: "Fecha de Ingreso" },
  ];

  function Equipos() {
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [data, setData] = useState([]);
    const [orderBy, setOrderBy] = useState("id_equipo");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:3001/api/equipos");
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
        if (orderBy === "fecha_ingreso") {
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

      const getEstadoColor = (estado) => {
        switch (estado) {
          case "disponible":
            return "#3df27b"; 
          case "en_préstamo":
            return "#feac54"; 
          case "en_reparación":
            return "#f8646d"; 
          default:
            return "black";
        }
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = { ...editRecord };
        const url = "http://localhost:3001/api/registro";
    
        try {
          if (editMode) {
            await axios.put(`${url}/${editRecord.id_equipo}`, postData);
            alert("Registro actualizado con éxito");
            setData((prevData) =>
              prevData.map((item) =>
                item.id_equipo === editRecord.id_equipo ? postData : item
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
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
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
                      <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} onClick={() => handleSort(column.id)}
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
                      {column.id === "estado" ? (
                        <span
                          style={{
                            backgroundColor: getEstadoColor(row[column.id]), 
                            color: "white", 
                            padding: "5px 10px", 
                            borderRadius: "5px", 
                            fontWeight: "bold",
                            display: "inline-block"
                          }}
                        >
                          {row[column.id]}
                        </span>
                      ) : (
                        row[column.id]
                      )}
                    </TableCell>
                    ))}
                    <TableCell>
                    <Button variant="outlined" onClick={() => handleEditRecord(row)} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' } }} >
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
                {editMode ? "Editar Registro" : "Agregar Nuevo Registro"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField name="nombre_equipo" label="Nombre Equipo" value={editRecord.nombre_equipo || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
                />
                <TextField name="tipo" label="Tipo"  value={editRecord.tipo || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
                />
                <TextField name="marca" label="Marca" value={editRecord.marca || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}/>
                <TextField name="modelo" label="Modelo" value={editRecord.modelo || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}
                />
                <FormControl sx={{ mb: 2 }} fullWidth>
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select labelId="estado-label" id="estado-select" name="estado" value={editRecord.estado || ""} onChange={handleInputChange} label="Estado"
                  >
                    <MenuItem value="disponible">Disponible</MenuItem>
                    <MenuItem value="en_préstamo">En Préstamo</MenuItem>
                    <MenuItem value="en_reparación">En Reparación</MenuItem>
                  </Select>
                </FormControl>
                <TextField name="ubicación" label="Ubicación" value={editRecord.ubicación || ""} onChange={handleInputChange} fullWidth sx={{ mb: 2 }}/>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" type="submit" sx={{ backgroundColor: "#d01c35" }}>
                      {editMode ? "Guardar Cambios" : "Agregar"}
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

  export default Equipos;
