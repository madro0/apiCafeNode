const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const usuarioModel = require('../models/usuarioModel');
const productoModel = require('../models/productoModel');

//dagault options
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los archivos no fueron subidos'
            }
        });
    }

    //validos tippo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivoUpload = req.files.archivo;

    //extenciones Permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = archivoUpload.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];


    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extencion no permitida, solo se admiten archivos con extenciones ' + extencionesValidas.join(', '),
                ext: extension
            }
        })
    }


    //cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    archivoUpload.mv(`uploads/imagenes/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aquí la imagen ya esta cargada 
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProductos(id, res, nombreArchivo);
        }



    });
});

function imagenUsuario(id, res, nombreArchivo) {

    usuarioModel.findById(id, (err, usuarioDB) => {

        if (err) {
            limpiarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            limpiarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existente'
                }
            });
        }

        limpiarArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioSaved) => {
            res.json({
                ok: true,
                usuario: usuarioSaved,
                img: nombreArchivo
            })
        });


    });
}

function imagenProductos(id, res, nombreArchivo) {

    productoModel.findById(id, (err, productoDB) => {
        if (err) {
            limpiarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            limpiarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto con id no encontrado'
                }
            })
        }

        limpiarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;


        productoDB.save((err, productoSaved) => {
            res.json({
                ok: true,
                producto: productoSaved,
                img: nombreArchivo
            })

        })
    });


}

function limpiarArchivo(nombreImg, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/imagenes/${tipo}/${nombreImg}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;