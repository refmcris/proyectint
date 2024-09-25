import React, { useState, useEffect } from 'react';
import Navbar from './sidebarus';
import { Button, Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TablePagination, TableSortLabel } from "@mui/material";
import axios from "axios";
import Cookies from 'js-cookie';

const columns = [
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "estado_prestamo", label: "Estado del préstamo" },
  { id: "fecha_devolucion", label: "Fecha de Devolución" }
];

function Misprestamos() {
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState("nombre_equipo");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const id_usuario = Cookies.get('id_usuario') || '';

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/prestamos-equipos/${id_usuario}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id_usuario]);

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
    function getrowcolor(estado_prestamo){
      
      switch(estado_prestamo){
        case 'pendiente':
          return '#feac54';
        case 'devuelto':
          return '#3df27b';
      }
    }
  return (
    <Box>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "100px" }}>
        <Typography variant="h4" gutterBottom>
          Mis Préstamos
        </Typography>
        <TableContainer component={Paper} sx={{borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', maxWidth: '1800px', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}  sx={{ fontWeight: 'bold', padding: '20px', borderBottom: '2px solid #ddd' }}>
                    <TableSortLabel  active={orderBy === column.id}  direction={orderBy === column.id ? order : "asc"}  onClick={() => handleSort(column.id)} >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {sortedData.map((row) => (
                <TableRow key={row.id_equipo}>
                {columns.map((column) => (
                    <TableCell key={column.id}  sx={{ borderBottom: '1px solid #ddd' }}>
                    {column.id === 'estado_prestamo' ? (
                        <Typography 
                        sx={{ display: 'inline-block',  backgroundColor: row[column.id] === 'pendiente' ? '#feac54' : row[column.id] === 'devuelto' ? '#3df27b' : 'inherit', borderRadius: '4px', padding: '4px 8px', textAlign: 'center' }} >
                        {row[column.id]}
                        </Typography>
                    ) : column.id === 'fecha_devolucion' ? (
                        new Date(row[column.id]).toLocaleDateString()
                    ) : (
                        row[column.id]
                    )}
                    </TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[ 10, 15, 30]}
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

export default Misprestamos;
