const express = require('express');
let { verificarToken, verificarRole } = require('../middlewares/auth');
const _ = require('underscore');
let categoriaModel = require('../models/categoriaModel');

let app = express();

//=================================
// Mostrar todas la categorias. 
//=================================

app.get('/categoria', (req, res) => {

    categoriaModel.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });



});

//=================================
// Mostrar una categoria por ID. 
//=================================

app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    categoriaModel.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de la categoria no se encuentra en la base de datos'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

//===============================
// Crear una uneva categoria. 
//===============================

app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    //req.suario._id

    let body = req.body;


    let catego = new categoriaModel({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    catego.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//===============================
// Actualizar la categoria 
//===============================

app.put('/categoria/:id', verificarToken, (req, res) => {

    //Actualizar la descripcion de la categoria.

    let id = req.params.id;
    let body = req.body;
    let categoriaUpdate = {
        descripcion: body.descripcion
    }

    categoriaModel.findByIdAndUpdate(id, categoriaUpdate, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB

        });
    })
});


//===============================
// eliminar las categorias
//===============================

app.delete('/categoria/:id', [verificarToken, verificarRole], (req, res) => {
    //solo un administrador puede borrar categorias. 
    //

    let id = req.params.id;

    categoriaModel.findByIdAndRemove(id, { new: true }, (err, categoriaDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDeleted
        });
    });
});

module.exports = app;