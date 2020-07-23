const express = require('express');
const app = express();

app.use(require('./usuarioController'));
app.use(require('./loginController'));
app.use(require('./categoriaController'));
app.use(require('./productoController'));


module.exports = app;