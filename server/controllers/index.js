const express = require('express');
const app = express();

app.use(require('./usuarioController'));
app.use(require('./loginController'));


module.exports = app;