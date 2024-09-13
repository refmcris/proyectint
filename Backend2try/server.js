const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; 

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uninventory'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida con éxito.');
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const values = [email, password];
    
    connection.query("SELECT * FROM usuarios WHERE correo_electronico = ? AND contraseña = ?", values, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res.status(400).send('Not Found');
        }
      }
    });
});
app.post('/api/register', (req, res) => {
    const { username, name, lastname, document, documentType, phone, password } = req.body;
  
    const query = `INSERT INTO usuarios (correo_electronico, nombre, apellido, documento, tipo_documento, telefono, contraseña) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [username, name, lastname, document, documentType, phone, password];
    
    connection.query(query, values, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send('User registered successfully');
      }
    });
  });
  app.get('/api/equipos', (req, res) => {
    const query = `SELECT * FROM equipos`;
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    });
  });
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
  app.post('/api/registro', (req, res) => {
    const { nombre_equipo, tipo, marca, modelo, estado, ubicación } = req.body;
  
    const query = `INSERT INTO equipos (nombre_equipo, tipo, marca, modelo, estado, ubicación) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
  
    const values = [nombre_equipo, tipo, marca, modelo, estado, ubicación];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send('Equipo agregado con éxito');
      }
    });
  });

  app.put('/api/registro/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_equipo, tipo, marca, modelo, estado, ubicación } = req.body;
  
    const query = `UPDATE equipos 
                   SET nombre_equipo = ?, tipo = ?, marca = ?, modelo = ?, estado = ?, ubicación = ? 
                   WHERE id_equipo = ?`;
  
    const values = [nombre_equipo, tipo, marca, modelo, estado, ubicación, id];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar registro:", err);  
        res.status(500).send(err);
      } else {
        res.status(200).send('Registro actualizado con éxito');
      }
    });
  });