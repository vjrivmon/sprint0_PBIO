const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mariadb = require('mariadb');  // Importar mariadb
const app = express();
const port = 8080;

// Middleware para procesar JSON
app.use(express.json());

// Configuración de la base de datos (similar a main.js)
const pool = mariadb.createPool({
  host: 'sprint0_mdb',
  user: 'root',
  password: '1234',
  database: 'ejemploBBDD',
  connectionLimit: 5
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Medicion:
 *       type: object
 *       required:
 *         - id
 *         - hora
 *         - lugar
 *         - id_sensor
 *         - valorGas
 *         - valorTemperatura
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la medición
 *         hora:
 *           type: string
 *           description: Hora de la medición
 *         lugar:
 *           type: string
 *           description: Lugar de la medición
 *         id_sensor:
 *           type: integer
 *           description: ID del sensor
 *         valorGas:
 *           type: number
 *           description: Valor de la medición de Gas
 *         valorTemperatura:
 *           type: number
 *           description: Valor de la medición de Temperatura
 *       example:
 *         id: 1
 *         hora: '10:00'
 *         lugar: 'Madrid'
 *         id_sensor: 101
 *         valorGas: 40
 *         valorTemperatura: 32
 */

/**
 * @swagger
 * tags:
 *   name: Mediciones
 *   description: API para gestionar las mediciones de los sensores de Gas y Temperatura
 */

/**
 * @swagger
 * /mediciones:
 *   get:
 *     summary: Obtiene todas las mediciones
 *     tags: [Mediciones]
 *     responses:
 *       200:
 *         description: Lista de todas las mediciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medicion'
 */
app.get('/mediciones', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query('SELECT * FROM mediciones');
    res.json(rows);
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).send('Error en la consulta');
  } finally {
    if (connection) connection.release();
  }
});

/**
 * @swagger
 * /mediciones:
 *   post:
 *     summary: Agrega una nueva medición
 *     tags: [Mediciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicion'
 *     responses:
 *       201:
 *         description: Medición creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicion'
 */
app.post('/mediciones', async (req, res) => {
  const nuevaMedicion = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'INSERT INTO mediciones (id, hora, lugar, id_sensor, valorGas, valorTemperatura) VALUES (?, ?, ?, ?, ?, ?)';
    await connection.query(query, [
      nuevaMedicion.id, 
      nuevaMedicion.hora, 
      nuevaMedicion.lugar, 
      nuevaMedicion.id_sensor, 
      nuevaMedicion.valorGas, 
      nuevaMedicion.valorTemperatura
    ]);
    res.status(201).json(nuevaMedicion);
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).send('Error al insertar los datos');
  } finally {
    if (connection) connection.release();
  }
});

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST de Mediciones',
      version: '1.0.0',
      description: 'API para gestionar las mediciones'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ]
  },
  apis: ['./servidorREST.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Servidor corriendo
app.listen(port, () => {
  console.log(`API REST corriendo en http://localhost:${port}/api-docs/`);
});

/*
pool.getConnection()
  .then(conn => {
    console.log("Conexión a la base de datos establecida");
    conn.release();
  })
  .catch(err => {
    console.error("Error al conectar a la base de datos:", err);
  });
*/