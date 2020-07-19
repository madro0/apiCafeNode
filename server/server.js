require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Importamos las rutas de usuario

app.use(require('./controllers/usuarioController'));



mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

    if (err)
        throw err;


    console.log('Base online');
});


app.listen(process.env.PORT, () => {
    console.log(`Server corriendo desde el puerto ${process.env.PORT} `);
})