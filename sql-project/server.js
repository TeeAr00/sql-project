const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server is running');
});