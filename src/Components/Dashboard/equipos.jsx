  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import {Button, Box, Dialog, DialogTitle,CircularProgress, DialogContent, DialogActions,TextField, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, TableSortLabel, Grid, Tooltip, IconButton, styled} from "@mui/material";
  import SideBar from "./sidebar";
  import { exportExcel } from "../../Common/exportExcel";
  import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
  import { ToastContainer, toast } from 'react-toastify'; 
  import 'react-toastify/dist/ReactToastify.css';


  import { Cloudinary } from 'cloudinary-core';


  const initialData = [];

  const columns = [
    { id: "nombre_equipo", label: "Nombre Equipo" },
    { id: "serial", label: "Serial" },
    { id: "tipo", label: "Tipo" },
    { id: "marca", label: "Marca" },
    { id: "modelo", label: "Modelo" },
    { id: "estado", label: "Estado" },
    { id: "ubicación", label: "Ubicación" },
    { id: "fecha_ingreso", label: "Fecha de Ingreso" },
    { id: "descripcion", label: "Descripcion" },
    { id: "imagen", label: "Imagen" },

  ];

  function Equipos() {
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [orderBy, setOrderBy] = useState("id_equipo");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);


    const cl = new Cloudinary({ cloud_name: 'tu_cloud_name' });
    
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:3001/api/equipos");
          setData(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    

    const handleOpenDialog = () => {
      setOpenDialog(true);
      setEditMode(false);
      setEditRecord({});
      setImageBase64('');
      setImageUploaded(false);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setEditRecord({});
      setImageBase64('');
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditRecord({ ...editRecord, [name]: value });
    };

    const handleEditRecord = (record) => {
      setEditMode(true);
      setEditRecord(record);
      setOpenDialog(true);
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

    const handleExport = () => {
      const cols = [
        { header: "ID Equipo", key: "id_equipo", width: 15 },
        { header: "Nombre Equipo", key: "nombre_equipo", width: 30 },
        { header: "Serial", key: "serial", width: 20 },
        { header: "Tipo", key: "tipo", width: 20 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Modelo", key: "modelo", width: 20 },
        { header: "Estado", key: "estado", width: 20 },
        { header: "Ubicación", key: "ubicación", width: 20 },
        { header: "Fecha de Ingreso", key: "fecha_ingreso", width: 20 },
      ];
  
      exportExcel({
        cols,
        data,
        sheetName: "Equipos",
        creator: "Tu Nombre", 
        handleLoading: (loadingState) => {

        },
      });
    };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const MAX_SIZE = 5 * 1024 * 1024; 

    if (file && file.size > MAX_SIZE) {
      alert("El archivo es demasiado grande. El límite es de 5MB.");
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !allowedTypes.includes(file.type)) {
      alert("Por favor, sube un archivo de imagen (JPG, PNG, GIF).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Uninventorys"); 
    setLoading(true); 

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/ds6fxjeak/image/upload`, formData);
      const imageUrl = response.data.secure_url;
      setImageBase64(imageUrl); 
      setImageUploaded(true); 
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
    } finally {
      setLoading(false); 
    }
  };

    const sortedData = filteredData
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
          case "en préstamo":
            return "#feac54"; 
          case "en reparación":
            return "#f8646d";
          case "retrasado":
            return "#f56c6c"; 
          default:
            return "black";
        }
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = {
          ...editRecord,
          imagen: imageBase64 || editRecord.imagen 
        };
        const url = "http://localhost:3001/api/registro";    
        try {
          if (editMode) {
            await axios.put(`${url}/${editRecord.id_equipo}`, postData);
            toast.success("Registro actualizado con éxito!",{autoClose:2000});
            setData((prevData) =>
                prevData.map((item) =>
                    item.id_equipo === editRecord.id_equipo ? postData : item
                )
            );
            fetchData();
            
          } else {
            await axios.post(url, postData);
            toast.success("Registro agregado con éxito!",{autoClose:2000});
            setData((prevData) => [...prevData, postData]);
            fetchData();
          }
          handleCloseDialog();
        } catch (error) {
          toast.error("Error al guardar registro!",{autoClose:2000});
        }
      };
      const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
      
        const filtered = data.filter((item) =>
          columns.some((column) => {
            const value = item[column.id];
            return typeof value === 'string' && value.toLowerCase().includes(searchValue);
          })
        );
      
        setFilteredData(filtered);
        setPage(0);
      };

      
    return (
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h4" sx={{ marginBottom: 2, color: '#333' }}>
          Registro de equipos
        </Typography>
          <Box sx={{display: "flex",justifyContent: "space-between",alignItems: "center", mb: 2,}}><TextField
          label="Buscar equipos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3, md: '300px' }}
        />
            <Button variant="contained" onClick={handleOpenDialog} sx={{ backgroundColor: "#d01c35" }}>
              Agregar Equipo
            </Button>
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
                            padding: "5px 10px",
                            borderRadius: "5px",
                            display: "inline-block"
                          }}
                        >
                          {row[column.id]}
                        </span>
                      ) : column.id === "imagen" ? (
                        <>
                          {row[column.id] ? (
                            <img 
                              src={row[column.id]}
                              alt="Imagen del equipo" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                              onClick={() => window.open(row[column.id])}
                            />
                          ) : (
                            <Typography variant="caption" color="textSecondary">Sin imagen</Typography>
                          )}
                        </>
                      ) : column.id === "fecha_ingreso" ? (
                        new Date(row.fecha_ingreso).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
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
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth >
          <DialogTitle>{editMode ? "Editar Registro" : "Agregar Nuevo Equipo"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField name="nombre_equipo" label="Nombre Equipo" value={editRecord.nombre_equipo || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField name="serial" label="Serial" value={editRecord.serial || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField name="tipo" label="Tipo" value={editRecord.tipo || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField name="marca" label="Marca" value={editRecord.marca || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField name="modelo" label="Modelo" value={editRecord.modelo || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              
              <FormControl sx={{ mb: 2 }} fullWidth required>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select labelId="estado-label" id="estado-select" name="estado" value={editRecord.estado || ""} onChange={handleInputChange} label="Estado">
                  <MenuItem value="disponible">Disponible</MenuItem>
                  <MenuItem value="en préstamo">En Préstamo</MenuItem>
                  <MenuItem value="en reparación">En Reparación</MenuItem>
                </Select>
              </FormControl>
              <TextField name="ubicación" label="Ubicación" value={editRecord.ubicación || ""} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
              <TextField
                name="descripcion"
                label="Descripción"
                value={editRecord.descripcion || ""}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4} 
                required
                sx={{ mb: 2 }}
              />
              <input type="file" onChange={handleFileChange} accept="image/*" />
              {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
              {imageUploaded && imageBase64 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Imagen subida: <a href={imageBase64} target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
                <Button onClick={handleCloseDialog} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' },marginRight:2 }}variant="outlined">Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#d01c35" }}>{editMode ? "Guardar Cambios" : "Agregar"}</Button>
              </Box>
              
            </DialogActions>
          </form>
        </Dialog>
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default Equipos;
