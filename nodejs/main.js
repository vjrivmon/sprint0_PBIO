const mariadb = require('mariadb');
const express = require('express');
const app = express();

// Configuración general de la base de datos
const config = {
  host: 'sprint0_mdb',  // Cambia el nombre según tu configuración de contenedor
  user: 'root',     // Usuario de la base de datos
  password: '1234', // Contraseña de la base de datos
  database: 'ejemploBBDD', // Nombre de tu base de datos
  connectionLimit: 5  // Límite de conexiones simultáneas
};

console.log("Creando pool...");
// Crear un pool de conexiones
const pool = mariadb.createPool(config);

process.on("SIGINT", function() {
    console.log("ctl-C detectado");
    process.exit();
});

// Ruta para consultar la base de datos
app.get('/', async (req, res) => {
  let connection;
  try {
    console.log("Conectando...");
    // Obtener una conexión del pool
    connection = await pool.getConnection();
    console.log("Conexión establecida.");

    // Realizar una consulta SELECT (puedes modificar la consulta según sea necesario)
    const rows = await connection.query('SELECT * FROM mediciones');
    
    // Enviar el resultado como respuesta
    res.json(rows);

  } catch (err) {
    console.error('Error: ', err);
    res.status(500).send('Error en la consulta a la base de datos');
  } finally {
    console.log("Liberando conexión...");
    // Liberar la conexión de vuelta al pool
    if (connection) {
      connection.release();
    }
    console.log("Fin del bloque finally.");
  }
});

// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
  console.log('Servidor escuchando en http://localhost:8080');
});