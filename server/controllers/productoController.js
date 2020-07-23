const express = require('express');
const { verificarToken } = require('../middlewares/auth');

let app = express();

let productosModel = require('../models/productoModel');
const productoModel = require('../models/productoModel');

//=================================
// Obtener todos los productos
//=================================

app.get('/productos', verificarToken, (req, res) => {
    //traer todos los productos
    //pupulate usuaio categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);


    productosModel.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});

//=================================
// Obtener producto by Id
//=================================
app.get('/productos/:id', verificarToken, (req, res) => {
    //populate; usuario categoria
    let id = req.params.id;

    productosModel.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ningun producto con este id'
                    }
                });

            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });


});

//=================================
// Buscar productos 
//=================================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    productoModel.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
});
//=================================
// Crear un nuevo producto 
//=================================
app.post('/productos', verificarToken, (req, res) => {
    //grabar nuevo producto
    //grabar una categoria del listado

    let body = req.body;
    let produc = new productosModel({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponble: body.disponble,
        categoria: body.categoria
    });

    produc.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })


});

//=================================
// Actualizar producto by Id
//=================================
app.put('/productos/:id', verificarToken, (req, res) => {
    //Actualizar producto

    let id = req.params.id;
    let body = req.body;

    let productoUpdate = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponble: body.disponble,
        categoria: body.categoria,
    };

    productoModel.findByIdAndUpdate(id, productoUpdate, { new: true, runValidators: true }, (err, productoUpdate) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoUpdate) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'producto con id no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            produc: productoUpdate
        })
    });


});

//=================================
// Eliminar producto by Id
//=================================
app.delete('/productos/:id', verificarToken, (req, res) => {
    //cambiar de estado disponble

    let id = req.params.id;


    productosModel.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de el producto no se encuentra en la base de datos'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((er, productoDeleted) => {
            if (er) {
                return res.status(500).json({
                    ok: false,
                    err: er
                });
            }

            res.json({
                ok: true,
                producto: productoDeleted,
                message: 'Producto eliminado'
            })
        })


    })
});



module.exports = app;