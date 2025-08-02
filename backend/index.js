const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use('/documents', require('./routes/documents'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
