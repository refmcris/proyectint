import React, {useState, useEffect} from 'react'
import Navbar from './sidebarus'
import Grid from '@mui/material/Grid2';
import {Button,Box,Modal,TextField,FormControl,InputLabel,Select,MenuItem,Typography,Table,TableContainer,TableHead,TableRow,TableCell,TableBody,Paper,TablePagination, TableSortLabel
} from "@mui/material";
import axios from "axios";

const initialData = [];

const columns = [
  { id: "nombre_equipo", label: "Nombre Equipo" },
  { id: "tipo", label: "Tipo" },
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
];
function Prestamos() {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState("id_equipo");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/equipos");
        const availableData = response.data.filter(item => item.estado === "disponible");
        setData(availableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
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

  return (
    <Box sx={{}}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
      <Typography variant="h4" gutterBottom>
          Lista de Equipos
        </Typography>
        <TableContainer sx={{ maxWidth: '1200',border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{fontWeight: 'bold' , padding: '20px',borderBottom: '2px solid #ddd'}}>
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
                <TableRow key={row.id_equipo}  onMouseEnter={() => setHoveredRow(row.id_equipo)} onMouseLeave={() => setHoveredRow(null)} >
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{borderBottom: '1px solid #ddd'}}>{row[column.id]}</TableCell>
                  ))}
                  <TableCell sx={{textAlign: 'right', width: 150 }}>
                    {hoveredRow === row.id_equipo && (
                      <Button variant="contained" color="primary">
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
          rowsPerPageOptions={[5, 10, 25]}
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

export default Prestamos;