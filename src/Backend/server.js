const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const moment = require('moment');

const bcrypt = require('bcrypt');


const app = express();
const port = 3001; 

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
          refreshToken: '1//04Gzz8REnqThzCgYIARAAGAQSNwF-L9IrnfYfQhpLn9ZyNZNGD5ODHMU0kfZU540KipetDxhb5dtbj6VsacCjkfyTnwmW3yinq9U', 
          accessToken: 'ya29.a0AcM612wBHdlgVcBmFj38EQoDTRMgA8vJI9_7F_293itj_i4dbXIrlGn7bi8dMIQkgzwOSb1gOrkDeXoDO4lnSDdvAxxQIdsRJiv_76AdslZjBYErpEJSHZF6BzQzs7D400iWEhAsTGgKWBKyB_IEwBEWeN6LXhwMAeaz1orpaCgYKASISARASFQHGX2MiQ1i3mSL40R2jSt2KpNfOgw0175'
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

  connection.query(
    "SELECT id_usuario, nombre, apellido, rol, correo_electronico, imagen, contraseña FROM usuarios WHERE correo_electronico = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error('Error al buscar el usuario:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        if (results.length > 0) {
          const user = results[0];
          const hashedPassword = user.contraseña;

          const isMatch = await bcrypt.compare(password, hashedPassword);
          if (isMatch) {

            delete user.contraseña;
            res.status(200).json(user);
          } else {
            res.status(401).send('Credenciales incorrectas');
          }
        } else {
          res.status(404).send('Usuario no encontrado');
        }
      }
    }
  );
});

app.post('/api/register', async (req, res) => {
  const { correo, name, lastname, document, documentType, phone, password } = req.body;
  console.log('Datos recibidos para registro:', req.body);

  try {

    const hashedPassword = await bcrypt.hash(password, 10); 

    const values = [correo, name, lastname, document, documentType, phone, hashedPassword, 'estudiante'];

    const query = `INSERT INTO usuarios (correo_electronico, nombre, apellido, documento, tipo_documento, telefono, contraseña, rol) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).send('Error al registrar el usuario');
      } else {
        res.status(201).send('Registrado correctamente');
      }
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).send('Error interno del servidor');
  }
});
  app.get('/api/equipos', (req, res) => {
    const query = `SELECT * FROM equipos`;

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
  app.post('/api/registro', (req, res) => {
    const { nombre_equipo, serial, tipo, marca, modelo, estado, ubicación, descripcion, imagen} = req.body;
  
    const query = `INSERT INTO equipos (nombre_equipo, serial, tipo, marca, modelo, estado, ubicación, descripcion, imagen) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [nombre_equipo,serial,tipo, marca, modelo, estado, ubicación, descripcion, imagen];
  
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
    const { nombre_equipo, serial, tipo, marca, modelo, estado, ubicación, descripcion, imagen } = req.body;
  
    const query = `UPDATE equipos 
                   SET nombre_equipo = ?, serial = ?, tipo = ?, marca = ?, modelo = ?, estado = ?, ubicación = ?, descripcion = ?, 
                   imagen = ? WHERE id_equipo = ?`;
  
    const values = [nombre_equipo, serial, tipo, marca, modelo, estado, ubicación, descripcion, imagen, id];
  
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
    const query = 'SELECT id_usuario, nombre, apellido, tipo_documento, documento, correo_electronico, telefono, imagen, rol FROM usuarios';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).send('Error al obtener los usuarios');
        return;
      }
      res.json(results); 
    });
  });
  app.put('/api/usuarios/:id',(req,res)=>{
    const{id} = req.params;
    const { nombre, apellido, tipo_documento, documento, correo_electronico, telefono, imagen, rol } = req.body;

    const query= `
    UPDATE usuarios 
    SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo_electronico = ?, telefono = ?, imagen = ?, rol = ? WHERE id_usuario = ? `;
    connection.query(query,[nombre, apellido, tipo_documento, documento, correo_electronico, telefono, imagen, rol, id],(err,results)=>{
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).send('Error al actualizar el usuario');
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send('Usuario no encontrado'); 
        return;
      }

      res.status(200).send('Usuario actualizado correctamente'); 
    });
});
  app.post('/api/prestamos', (req, res) => {
    const { id_usuario, id_equipo, serial, fecha_devolucion } = req.body;
    const fecha_prestamo = new Date(); 
    const estado = 'en préstamo';

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
        const equipoValues = ['en préstamo', id_equipo];
  
        connection.query(queryEquipo, equipoValues, (err, result) => {
          if (err) {
            console.error('Error al actualizar el estado del equipo:', err);
            res.status(500).send('Error al actualizar el estado del equipo');
          } else {
            res.status(201).send('Préstamo registrado y estado del equipo actualizado a "en préstamo"');
          }
        });
      }
    });
  });
  app.post('/api/prestamos-externos', (req, res) => {
    const { id_usuario, nombre, apellido, id_equipo,serial,fecha_devolucion } = req.body;
    const fecha_prestamo = new Date(); 
    const estado = 'en préstamo';

    const queryPrestamo = `INSERT INTO préstamosinternos(id_usuario, nombre, apellido, id_equip, serial, fecha_prestamo, fecha_devolucion, estado_prestamo)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const prestamoValues = [id_usuario, nombre, apellido, id_equipo, serial, fecha_prestamo, fecha_devolucion, estado];
  
    connection.query(queryPrestamo, prestamoValues, (err, result) => {
        if (err) {
            console.error('Error al registrar el préstamo:', err);
            res.status(500).send('Error al registrar el préstamo');
        } else {
            const queryEquipo = `UPDATE equipos SET estado = ? WHERE id_equipo = ?`;
            const equipoValues = ['en préstamo', id_equipo];

            connection.query(queryEquipo, equipoValues, (err, result) => {
                if (err) {
                    console.error('Error al actualizar el estado del equipo:', err);
                    res.status(500).send('Error al actualizar el estado del equipo');
                } else {
                    res.status(201).send('Préstamo registrado y estado del equipo actualizado a "en préstamo"');
                }
            });
        }
    });
});
app.get('/api/prestamos-internos', (req, res) => {
  const query = `
    SELECT pi.id_usuario, pi.id_prestamo, pi.id_usuario, pi.Nombre AS nombre_usuario, pi.Apellido AS apellido_usuario, 
           e.nombre_equipo, e.serial, e.tipo, e.marca, e.modelo, 
           pi.estado_prestamo, pi.fecha_prestamo, pi.fecha_devolucion
    FROM préstamosinternos pi
    JOIN equipos e ON pi.id_equip = e.id_equipo
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los préstamos internos:', err);
      res.status(500).send('Error al obtener los préstamos internos');
    } else {
      res.status(200).json(results);
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
       let updateEquipoQuery;
      let newEquipoStatus;

      if (estado === 'devuelto') {
        newEquipoStatus = 'disponible';
      } else if (estado === 'en préstamo') {
        newEquipoStatus = 'en préstamo';
      }else if (estado === 'en reparación') {
        newEquipoStatus = 'en reparación';
      }  else {
        res.status(200).send('Préstamo actualizado correctamente');
        return;
      }

      updateEquipoQuery = `
        UPDATE equipos 
        SET estado = ? 
        WHERE id_equipo = (
          SELECT id_equipo
          FROM préstamos 
          WHERE id_prestamo = ?)`;

      connection.query(updateEquipoQuery, [newEquipoStatus, id_prestamo], (err, results) => {
        if (err) {
          console.error('Error al actualizar el estado del equipo:', err);
          res.status(500).send('Error al actualizar el estado del equipo');
        } else {
          res.status(200).send('Préstamo y equipo actualizados correctamente');
        }
      });
    }
  });
});

app.put('/api/prestamos-equipos-internos/:id_prestamo', (req, res) => {
  const { id_prestamo } = req.params;
  const { estado } = req.body;

  console.log('ID de préstamo recibido:', id_prestamo);
  console.log('Estado recibido:', estado);

  const updatePrestamoQuery = `
    UPDATE préstamosinternos 
    SET estado_prestamo = ? 
    WHERE id_prestamo = ?`;

  connection.query(updatePrestamoQuery, [estado, id_prestamo], (err, results) => {
    if (err) {
      console.error('Error al actualizar el préstamo:', err);
      res.status(500).send('Error al actualizar el préstamo');
    } else {
      let updateEquipoQuery;
      let newEquipoStatus;

      if (estado === 'devuelto') {
        newEquipoStatus = 'disponible';
      } else if (estado === 'en préstamo') {
        newEquipoStatus = 'en préstamo';
      }else if (estado === 'en reparación') {
        newEquipoStatus = 'en reparación';
      }else {
        res.status(200).send('Préstamo actualizado correctamente');
        return;
      }

      updateEquipoQuery = `
        UPDATE equipos 
        SET estado = ? 
        WHERE id_equipo = (
          SELECT id_equip
          FROM préstamosinternos 
          WHERE id_prestamo = ?)`;

      connection.query(updateEquipoQuery, [newEquipoStatus, id_prestamo], (err, results) => {
        if (err) {
          console.error('Error al actualizar el estado del equipo:', err);
          res.status(500).send('Error al actualizar el estado del equipo');
        } else {
          res.status(200).send('Préstamo y equipo actualizados correctamente');
        }
      });
    }
  });
});

const checkForDelayedLoans = () => {
  const selectQuery = `
    SELECT u.correo_electronico, p.id_prestamo, p.fecha_devolucion, e.nombre_equipo
    FROM préstamos p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN equipos e ON p.id_equipo = e.id_equipo
    WHERE p.estado_prestamo = 'en préstamo' AND p.fecha_devolucion < CURDATE();
  `;

  connection.query(selectQuery, (err, delayedLoans) => {
    if (err) {
      console.error('Error al seleccionar correos de préstamos pendientes:', err);
      return;
    }

    if (delayedLoans.length > 0) {
      console.log(`Préstamos encontrados en retraso: ${delayedLoans.length}`);
      
      delayedLoans.forEach((loan) => {
        sendDelayEmail(loan.correo_electronico, loan.nombre_equipo);
        console.log(`Correo enviado a: ${loan.correo_electronico}`);
      });
      const updateQuery = `
        UPDATE préstamos
        SET estado_prestamo = 'retrasado'
        WHERE fecha_devolucion < CURDATE() AND estado_prestamo = 'en préstamo';
      `;

      connection.query(updateQuery, (err, result) => {
        if (err) {
          console.error('Error al actualizar préstamos a retrasado:', err);
          return;
        }

        console.log(`Préstamos actualizados a "retrasado": ${result.affectedRows}`);
      });
    } else {
      console.log('No se encontraron préstamos pendientes que estén retrasados.');
    }
  });
};



const sendDelayEmail = (to, teamName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'univentory1@gmail.com',
      clientId: '738690101223-sehppvhn9qapplbestmra3aar6gmmhig.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04jfvESrZDyN9CgYIARAAGAQSNwF-L9Irud8StNE2c1mdzYc1Y9192wexlVCZhHVtUD8IZVLVbKNeODExybWTZRbMs4B0MR5rsXY', 
      accessToken: 'ya29.a0AcM612yTLq89hCKd-ci6iZPNGYicRx2Z1D6f3pXLRASxrTRLgquBOO3mGG10Cn1cX0HdWC_S6AheSGz9JCQtyGV9yhGFw4-BP8YfSJ3eKNS-UTsC8a_0UC7SwAUC7bBfmalZA211bKtISODmVGwQqYfz-HWzNjRxmN0KBrlXaCgYKAf0SARASFQHGX2Mixrd3pBB8w2MkYVeGC8g_Tg0175'
    },
  });

  const subject = 'Notificación de Préstamo Retrasado';
  const htmlcontent = `<p>Tu préstamo con del equipo  ${teamName} está retrasado. Por favor, ponte en contacto para devolver el equipo.</p>`;

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
    WHERE p.fecha_devolucion = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND p.estado_prestamo = 'en préstamo';
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
      refreshToken: '1//04jfvESrZDyN9CgYIARAAGAQSNwF-L9Irud8StNE2c1mdzYc1Y9192wexlVCZhHVtUD8IZVLVbKNeODExybWTZRbMs4B0MR5rsXY', 
      accessToken: 'ya29.a0AcM612yTLq89hCKd-ci6iZPNGYicRx2Z1D6f3pXLRASxrTRLgquBOO3mGG10Cn1cX0HdWC_S6AheSGz9JCQtyGV9yhGFw4-BP8YfSJ3eKNS-UTsC8a_0UC7SwAUC7bBfmalZA211bKtISODmVGwQqYfz-HWzNjRxmN0KBrlXaCgYKAf0SARASFQHGX2Mixrd3pBB8w2MkYVeGC8g_Tg0175'
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



// charts


app.get('/api/equipos/utilizadoslineamonth', (req, res) => {
  const query = `
    SELECT DATE_FORMAT(fecha_prestamo, '%Y-%m') AS mes, COUNT(*) AS cantidad 
    FROM préstamos 
    GROUP BY mes 
    ORDER BY mes;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error en la consulta de la base de datos:', error);
      return res.status(500).json({ error: 'Error en la consulta de la base de datos.' });
    }
    res.json(results);
  });
});

app.get('/api/equipos/utilizadoslinea', (req, res) => {
  const { startDate, endDate } = req.query;

  console.log(req.query)

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Se requieren startDate y endDate como parámetros de consulta.' });
  }

  const query = `
      SELECT DATE(fecha_prestamo) AS fecha, COUNT(*) AS cantidad
      FROM préstamos
      WHERE fecha_prestamo BETWEEN ? AND ?
      GROUP BY DATE(fecha_prestamo)

      UNION ALL

      SELECT DATE(fecha_prestamo) AS fecha, COUNT(*) AS cantidad
      FROM préstamosinternos
      WHERE fecha_prestamo BETWEEN ? AND ?
      GROUP BY DATE(fecha_prestamo)

      ORDER BY fecha ASC;
  `;

  connection.query(query, [startDate, endDate, startDate, endDate], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error en la consulta de la base de datos.' });
    }
    res.json(results);
  });
});

app.get('/api/equipos/utilizados', (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Se requiere un rango de fechas.' });
  }

  const query = `
    SELECT e.id_equipo, e.nombre_equipo, COUNT(*) AS cantidad
    FROM (
        SELECT id_equipo, fecha_prestamo FROM préstamos WHERE fecha_prestamo BETWEEN ? AND ?
        UNION ALL
        SELECT id_equip, fecha_prestamo FROM préstamosinternos WHERE fecha_prestamo BETWEEN ? AND ?
    ) AS todos_los_prestamos
    JOIN equipos e ON e.id_equipo = todos_los_prestamos.id_equipo
    GROUP BY e.id_equipo, e.nombre_equipo
    ORDER BY cantidad DESC
  `;

  connection.query(query, [start, end, start, end], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error en la consulta de la base de datos.' });
    }
    res.json(results);
  });
});

// notificaciones para el usuario en su perfil

app.get('/api/notificaciones/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const selectQuery = `
    SELECT * FROM notificaciones
    WHERE id_usuario = ? 
  `;

  connection.query(selectQuery, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener notificaciones:', err);
      return res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
    res.json(results);
  });
});
  app.delete('/api/notificaciones/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = `
      DELETE FROM notificaciones
      WHERE id_notificacion = ?
    `;

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar la notificación:', err);
      return res.status(500).json({ error: 'Error al eliminar la notificación' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.status(200).json({ message: 'Notificación eliminada con éxito' });
  });
});

const addNotificationToDB = (id_usuario, message) => {
  const insertQuery = `
    INSERT INTO notificaciones (id_usuario, mensaje)
    VALUES (?, ?);
  `;

  connection.query(insertQuery, [id_usuario, message], (err, result) => {
    if (err) {
      console.error('Error al agregar notificación a la base de datos:', err);
      return;
    }
    console.log(`Notificación agregada a la base de datos con ID: ${result.insertId}`);
  });
};

const checkForLoansReminder = () => {
  const selectQuery = `
    SELECT u.id_usuario, p.id_prestamo, p.fecha_devolucion, e.nombre_equipo
    FROM préstamos p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN equipos e ON p.id_equipo = e.id_equipo
    WHERE p.estado_prestamo = 'en préstamo' AND p.fecha_devolucion = CURDATE() + INTERVAL 1 DAY;
  `;

  connection.query(selectQuery, (err, upcomingLoans) => {
    if (err) {
      console.error('Error al seleccionar préstamos a punto de vencer:', err);
      return;
    }

    if (upcomingLoans.length > 0) {
      console.log(`Préstamos a punto de vencer encontrados: ${upcomingLoans.length}`);
      
      upcomingLoans.forEach((loan) => {
        const notificationMessage = `Su préstamo está por vencerse: ${loan.nombre_equipo} debe ser devuelto mañana.`;
        addNotificationToDB(loan.id_usuario, notificationMessage);
        console.log(`Notificación agregada para el usuario ID: ${loan.id_usuario}`);
      });
    } else {
      console.log('No se encontraron préstamos a punto de vencer.');
    }
  });
};
const checkForOverdueLoans = () => {
  const selectQuery = `
    SELECT u.id_usuario, p.id_prestamo, p.fecha_devolucion, e.nombre_equipo
    FROM préstamos p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN equipos e ON p.id_equipo = e.id_equipo
    WHERE p.estado_prestamo = 'en préstamo' AND p.fecha_devolucion < CURDATE();
  `;

  connection.query(selectQuery, (err, overdueLoans) => {
    if (err) {
      console.error('Error al seleccionar préstamos vencidos:', err);
      return;
    }

    if (overdueLoans.length > 0) {
      console.log(`Préstamos vencidos encontrados: ${overdueLoans.length}`);
      
      overdueLoans.forEach((loan) => {
        const notificationMessage = `Su préstamo está vencido: ${loan.nombre_equipo} debió ser devuelto ayer. Por favor, devuélvalo lo antes posible.`;
        addNotificationToDB(loan.id_usuario, notificationMessage);
        console.log(`Notificación de vencimiento agregada para el usuario ID: ${loan.id_usuario}`);
      });
    } else {
      console.log('No se encontraron préstamos vencidos.');
    }
  });
};

checkForLoansReminder();
checkForOverdueLoans();
//correos 
// checkForUpcomingReturns();
// checkForDelayedLoans();

// new try