const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const usuarioModel = require('../models/usuarioModel');
const app = express();


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);






    usuarioModel.find({ estado: true }, 'nombre email role google estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            usuarioModel.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            })


        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;


    let usua = new usuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usua.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});



app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    usuarioModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });



    })

    //  res.json({ id });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // usuarioModel.findByIdAndRemove(id, (err, userDelete) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!userDelete) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }


    //     res.json({
    //         ok: true,
    //         usuario: userDelete
    //     })
    // })


    usuarioModel.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userUpdate) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userUpdate
        })

    });

});

module.exports = app;