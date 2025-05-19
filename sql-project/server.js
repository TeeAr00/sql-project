const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');

dotenv.config();
// databasen tiedot dotenvistä
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const PORT = process.env.PORT

//routes
const testRoute = require('./routes/testRoute')(db);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/testRoute', testRoute);


app.listen(PORT, () => {
  console.log('Server is running');
});