const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificarTokenImg } = require('../middlewares/auth');
let app = express();


app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;



    let pathImagen = path.resolve(__dirname, `../../uploads/imagenes/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagenPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagenPath);
    }



})

module.exports = app;