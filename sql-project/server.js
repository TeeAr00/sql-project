const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');

dotenv.config();
// databasen tiedot dotenvistä
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db2 = mysql.createPool({
  host: process.env.DB_HOST2,
  user: process.env.DB_USER2,
  password: process.env.DB_PASSWORD2,
  database: process.env.DB_NAME2,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const PORT = 5000;

//routes
const testRoute = require('./routes/testRoute')(db,db2);
const exercisesRouter = require('./routes/exercises')(db,db2);
const registerRouter = require('./routes/register')(db2);
const loginRouter = require('./routes/login')(db2);
const profileRouter = require('./routes/profile')(db2);
const editSetsRouter = require('./routes/editSets')(db,db2);
const scoresRouter = require('./routes/scores')(db,db2);
const sandboxTestsRouter = require('./routes/sandboxTests')(db);
const exercises2Router = require('./routes/exercises2')(db);


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/testRoute', testRoute);
app.use('/api/exercises', exercisesRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/profile', profileRouter);
app.use('/api/editSets', editSetsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/sandboxTests', sandboxTestsRouter);
app.use('/api/exercises2', exercises2Router);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//bäkkäri testi
app.get('/ping', (req, res) => {
  res.send('pong');
});
