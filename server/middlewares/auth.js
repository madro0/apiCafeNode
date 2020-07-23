const jwt = require('jsonwebtoken');

//=============================
//Verificar Token
//=============================

let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                err: {
                    message: "Autorization (token) invalido"
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    });


};

//=============================
//Verificar AdminRole
//=============================

let verificarRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            err: {
                message: "Esta cuenta no posee permisos de administrador"
            }
        });
    }

    next();
};



module.exports = {
    verificarToken,
    verificarRole
}