const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const moment = require('moment');



const app = express();
const port = 3001; 
const axios = require('axios');

const mysql = require('mysql2');
const EmailTemplate = require('../Components/DashboardUsuarios/emailtemplate');

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

app.use(cors({
  origin: 'http://localhost:3000', 
}));
app.use(bodyParser.json());
app.use(express.json());



app.post('/api/checkEmail', async (req, res) => {
  const { email } = req.body;
  

  try {
      const [user] = await connection.promise().query('SELECT * FROM usuarios WHERE correo_electronico = ?', [email]);
      
      if (user.length === 0) {
          return res.status(404).json({ error: 'Correo electrónico no encontrado.' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      expirationTime = moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      await connection.promise().query(
        'INSERT INTO usuariostokens (correo_electronico, token, expiration_time) VALUES (?, ?, ?)',
        [email, token, expirationTime]
      );

      res.status(200).json({ message: 'Correo electrónico encontrado.', token });
  } catch (error) {
      console.error('Error al verificar el correo:', error);
      res.status(500).json({ error: 'Error al verificar el correo.' });
  }
});



app.post('/api/sendEmail', async (req, res) => {
  const { from, to, subject,token } = req.body;

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          type: 'OAuth2',
          user: 'univentory1@gmail.com', 
          clientId: '738690101223-sehppvhn9qapplbestmra3aar6gmmhig.apps.googleusercontent.com', 
          clientSecret: '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', 
          refreshToken: '1//04H149qzClLXUCgYIARAAGAQSNwF-L9Ir__xjhwOVwCAvoiogDhNXgVSH56xA61LBi1d8lm_ywijsE3hdOqeEy1U4htKdSuMWBww', 
          accessToken: 'ya29.a0AcM612wOTiP2C6pFSl-dDw2e0DPmf-U8-c83QSkJybMn5-5m_2dcePTiRihZrfe15JNF6lIOG2uMqZU4coa_H0K5Wvn80-4es8BX5k4c-dUNLgO_HN6jywyjZiJlFqyIspyTENUhzYeO-Qup1YCFTZiyF48BiPmRfKnxB5-3aCgYKAb0SARASFQHGX2MiwK3bWYWvspSWoaiPIp8-hw0175'
      }
  });
  const resetLink = `http://localhost:3000/contrarecupera?token=${token}`;
  const htmlcontent = EmailTemplate(resetLink);

  const mailOptions = {
      from,
      to,
      subject,
      html: htmlcontent, 
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito', info });
} catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo', details: error });
}
});
  
app.put('/api/resetPassword', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const [tokenData] = await connection.promise().query(
      'SELECT * FROM usuariostokens WHERE token = ?',
      [token]
    );

    if (tokenData.length === 0) {
      return res.status(404).json({ error: 'Token no válido o expirado.' });
    }

    const { correo_electronico } = tokenData[0]; 
    console.log(correo_electronico);
    await connection.promise().query(
      'UPDATE usuarios SET contraseña = ? WHERE correo_electronico = ?',
      [newPassword, correo_electronico]
    );

    await connection.promise().query(
      'DELETE FROM usuariostokens WHERE token = ?',
      [token]
    );

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña.' });
  }
});



app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const values = [email, password];

  connection.query(
    "SELECT id_usuario, nombre, apellido, rol, correo_electronico FROM usuarios WHERE correo_electronico = ? AND contraseña = ?",
    values,
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res.status(400).send('Not Found');
        }
      }
    }
  );
});
app.post('/api/register', (req, res) => {
    const { correo, name, lastname, document, documentType, phone, password } = req.body;
    console.log('Datos recibidos para registro:', req.body);
  
    const values = [correo, name, lastname, document, documentType, phone, password,'estudiante'];

    const query = `INSERT INTO usuarios (correo_electronico, nombre, apellido, documento, tipo_documento, telefono, contraseña,rol) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
   
    
    connection.query(query, values, (err, result) => {
      if (err) {
        res.status(500).send(err);
        
      } else {
        res.status(201).send('Registrado correctamente');
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
    const { nombre_equipo, serial, tipo, marca, modelo, estado, ubicación } = req.body;
  
    const query = `INSERT INTO equipos (nombre_equipo, serial, tipo, marca, modelo, estado, ubicación) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [nombre_equipo,serial,tipo, marca, modelo, estado, ubicación];
  
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
    const { nombre_equipo, serial, tipo, marca, modelo, estado, ubicación } = req.body;
  
    const query = `UPDATE equipos 
                   SET nombre_equipo = ?, serial = ?, tipo = ?, marca = ?, modelo = ?, estado = ?, ubicación = ? 
                   WHERE id_equipo = ?`;
  
    const values = [nombre_equipo, serial, tipo, marca, modelo, estado, ubicación, id];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar registro:", err);  
        res.status(500).send(err);
      } else {
        res.status(200).send('Registro actualizado con éxito');
      }
    });
  });

app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT nombre, apellido, tipo_documento, documento, correo_electronico, telefono, rol FROM usuarios';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).send('Error al obtener los usuarios');
        return;
      }
      res.json(results); 
    });
  });
  app.post('/api/prestamos', (req, res) => {
    const { id_usuario, id_equipo, serial, fecha_devolucion } = req.body;
    const fecha_prestamo = new Date(); 
    const estado = 'pendiente';

    const queryPrestamo = `INSERT INTO préstamos(id_usuario, id_equipo, serial, fecha_prestamo, fecha_devolucion, estado_prestamo)
                           VALUES (?, ?, ?, ?, ?, ?)`;
    
    const prestamoValues = [id_usuario, id_equipo, serial, fecha_prestamo, fecha_devolucion,estado];
    
  
    connection.query(queryPrestamo, prestamoValues, (err, result) => {
      if (err) {
        console.error('Error al registrar el préstamo:', err);
        res.status(500).send('Error al registrar el préstamo');
      } 
      else {
        const id_prestamo = result.insertId;
        const queryHistorial = `INSERT INTO historialpréstamos(id_prestamo, id_usuario, id_equipo, serial, fecha_prestamo, fecha_devolucion)
                              VALUES (?, ?, ?, ?, ?, ?)`;

        const historialValues = [id_prestamo, id_usuario, id_equipo, serial, fecha_prestamo, fecha_devolucion];
        connection.query(queryHistorial, historialValues);
          
        const queryEquipo = `UPDATE equipos SET estado = ? WHERE id_equipo = ?`;
        const equipoValues = ['en_préstamo', id_equipo];
  
        connection.query(queryEquipo, equipoValues, (err, result) => {
          if (err) {
            console.error('Error al actualizar el estado del equipo:', err);
            res.status(500).send('Error al actualizar el estado del equipo');
          } else {
            res.status(201).send('Préstamo registrado y estado del equipo actualizado a "en_préstamo"');
          }
        });
      }
    });
  });
  app.post('/api/prestamos-externos', (req, res) => {
    const { id_usuario, nombre, apellido, id_equipo,serial,fecha_devolucion } = req.body;
    const fecha_prestamo = new Date(); 
    const estado = 'pendiente';

    const queryPrestamo = `INSERT INTO préstamos(id_usuario, nombre, apellido, id_equipo, serial, fecha_prestamo, fecha_devolucion, estado_prestamo)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const prestamoValues = [id_usuario, nombre, apellido, id_equipo, serial, fecha_prestamo, fecha_devolucion, estado];
  
    connection.query(queryPrestamo, prestamoValues, (err, result) => {
        if (err) {
            console.error('Error al registrar el préstamo:', err);
            res.status(500).send('Error al registrar el préstamo');
        } else {
            const queryEquipo = `UPDATE equipos SET estado = ? WHERE id_equipo = ?`;
            const equipoValues = ['en_préstamo', id_equipo];

            connection.query(queryEquipo, equipoValues, (err, result) => {
                if (err) {
                    console.error('Error al actualizar el estado del equipo:', err);
                    res.status(500).send('Error al actualizar el estado del equipo');
                } else {
                    res.status(201).send('Préstamo registrado y estado del equipo actualizado a "en_préstamo"');
                }
            });
        }
    });
});
  

  app.get('/api/prestamos-equipos/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
  
    const query = `
      SELECT e.nombre_equipo, e.tipo, e.marca, e.modelo, e.estado, p.fecha_prestamo, p.fecha_devolucion, p.estado_prestamo
      FROM préstamos p
      JOIN equipos e ON p.id_equipo = e.id_equipo
      WHERE p.id_usuario = ?
    `;
  
    connection.query(query, [id_usuario], (err, results) => {
      if (err) {
        console.error('Error al obtener los préstamos y equipos:', err);
        res.status(500).send('Error al obtener los préstamos y equipos');
      } else {
        res.status(200).json(results);
      }
    });
  });
  app.get('/api/prestamos-equipos', (req, res) => {
    const query = `
      SELECT p.id_prestamo, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario, 
             e.nombre_equipo, e.tipo, e.marca, e.modelo,e.serial, 
             p.estado_prestamo, p.fecha_prestamo, p.fecha_devolucion
      FROM préstamos p
      JOIN equipos e ON p.id_equipo = e.id_equipo
      JOIN usuarios u ON p.id_usuario = u.id_usuario
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener los préstamos, usuarios y equipos:', err);
        res.status(500).send('Error al obtener los préstamos, usuarios y equipos');
      } else {
        res.status(200).json(results);
      }
    });
  });

  app.put('/api/prestamos-equipos/:id_prestamo', (req, res) => {
    const { id_prestamo } = req.params;
    const { estado } = req.body;

    const updatePrestamoQuery = `
      UPDATE préstamos 
      SET estado_prestamo = ? 
      WHERE id_prestamo = ?`;

    connection.query(updatePrestamoQuery, [estado, id_prestamo], (err, results) => {
      if (err) {
        console.error('Error al actualizar el préstamo:', err);
        res.status(500).send('Error al actualizar el préstamo');
      } else {

        if (estado === 'devuelto') {
          const updateEquipoQuery = `
            UPDATE equipos 
            SET estado = 'disponible' 
            WHERE id_equipo = (
              SELECT id_equipo 
              FROM préstamos 
              WHERE id_prestamo = ?)`;

          connection.query(updateEquipoQuery, [id_prestamo], (err, results) => {
            if (err) {
              console.error('Error al actualizar el estado del equipo:', err);
              res.status(500).send('Error al actualizar el estado del equipo');
            } else {
              res.status(200).send('Préstamo y equipo actualizados correctamente');
            }
          });
        } else {
          res.status(200).send('Préstamo actualizado correctamente');
        }
      }
    });
});

const checkForDelayedLoans = () => {
  const updateQuery = `
    UPDATE préstamos
    SET estado_prestamo = 'retrasado'
    WHERE fecha_devolucion < CURDATE() AND estado_prestamo = 'pendiente';
  `;

  connection.query(updateQuery, (err, result) => {
    if (err) {
      console.error('Error al actualizar préstamos a retrasado:', err);
      return;
    }

    if (result.affectedRows > 0) {
      console.log(`Préstamos actualizados a "retrasado": ${result.affectedRows}`);

      const selectQuery = `
        SELECT u.correo_electronico, p.id_prestamo
        FROM préstamos p
        INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
        WHERE p.estado_prestamo = 'retrasado' AND p.fecha_devolucion < CURDATE();
      `;

      connection.query(selectQuery, (err, delayedLoans) => {
        if (err) {
          console.error('Error al seleccionar correos de préstamos retrasados:', err);
          return;
        }
        delayedLoans.forEach((loan) => {
          sendDelayEmail(loan.correo_electronico, loan.id_prestamo);
          console.log(loan.correo_electronico);
        });
      });
    } else {
      console.log('No se encontraron préstamos pendientes que estén retrasados.');
    }
  });
};


const sendDelayEmail = (to, loanId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'univentory1@gmail.com',
      clientId: '738690101223-sehppvhn9qapplbestmra3aar6gmmhig.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04H149qzClLXUCgYIARAAGAQSNwF-L9Ir__xjhwOVwCAvoiogDhNXgVSH56xA61LBi1d8lm_ywijsE3hdOqeEy1U4htKdSuMWBww', 
      accessToken: 'ya29.a0AcM612wOTiP2C6pFSl-dDw2e0DPmf-U8-c83QSkJybMn5-5m_2dcePTiRihZrfe15JNF6lIOG2uMqZU4coa_H0K5Wvn80-4es8BX5k4c-dUNLgO_HN6jywyjZiJlFqyIspyTENUhzYeO-Qup1YCFTZiyF48BiPmRfKnxB5-3aCgYKAb0SARASFQHGX2MiwK3bWYWvspSWoaiPIp8-hw0175'
    },
  });

  const subject = 'Notificación de Préstamo Retrasado';
  const htmlcontent = `<p>Tu préstamo con ID ${loanId} está retrasado. Por favor, ponte en contacto para devolver el equipo.</p>`;

  const mailOptions = {
    from: 'univentory1@gmail.com',
    to,
    subject,
    html: htmlcontent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log(`Correo enviado con éxito a ${to} para el préstamo ID: ${loanId}`);
    }
  });
};
const checkForUpcomingReturns = () => {
  const selectQuery = `
    SELECT u.correo_electronico, p.id_prestamo, p.fecha_devolucion, e.nombre_equipo
    FROM préstamos p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN equipos e ON p.id_equipo = e.id_equipo
    WHERE p.fecha_devolucion = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND p.estado_prestamo = 'pendiente';
  `;

  connection.query(selectQuery, (err, upcomingLoans) => {
    if (err) {
      console.error('Error al seleccionar correos de préstamos próximos a vencerse:', err);
      return;
    }

    if (upcomingLoans.length > 0) {
      upcomingLoans.forEach((loan) => {
        sendUpcomingReturnEmail(loan.correo_electronico, loan.id_prestamo, loan.fecha_devolucion, loan.nombre_equipo);
       
      });
    } else {
      console.log('No se encontraron préstamos que venzan mañana.');
    }
  });
};

const sendUpcomingReturnEmail = (to, loanId, dueDate, equipmentName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'univentory1@gmail.com',
      clientId: '738690101223-sehppvhn9qapplbestmra3aar6gmmhig.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04H149qzClLXUCgYIARAAGAQSNwF-L9Ir__xjhwOVwCAvoiogDhNXgVSH56xA61LBi1d8lm_ywijsE3hdOqeEy1U4htKdSuMWBww', 
      accessToken: 'ya29.a0AcM612wOTiP2C6pFSl-dDw2e0DPmf-U8-c83QSkJybMn5-5m_2dcePTiRihZrfe15JNF6lIOG2uMqZU4coa_H0K5Wvn80-4es8BX5k4c-dUNLgO_HN6jywyjZiJlFqyIspyTENUhzYeO-Qup1YCFTZiyF48BiPmRfKnxB5-3aCgYKAb0SARASFQHGX2MiwK3bWYWvspSWoaiPIp8-hw0175'
    },
  });

  const subject = 'Recordatorio de Devolución de Préstamo';
  const htmlcontent = `
    <p>Tu préstamo  <strong>${equipmentName}</strong> vence el ${dueDate}. Por favor, asegúrate de devolver el equipo a tiempo.</p>
    <p>Gracias,</p>
    <p>Equipo Uninventory</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: htmlcontent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de recordatorio:', error);
    } else {
      console.log(`Correo de recordatorio enviado con éxito a ${to} para el préstamo ID: ${loanId}, Equipo: ${equipmentName}`);
    }
  });
};

checkForUpcomingReturns();


checkForDelayedLoans();