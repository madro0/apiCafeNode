//=======================================
//PUERTO!
//=======================================

const { identity } = require("underscore");

process.env.PORT = process.env.PORT || 3000;


//=======================================
//Entrono!
//=======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================================
//vencimiento del Token 
//=======================================
//60 segundo
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================================
//SEED de autenticacón 
//=======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//=======================================
//Base de datos!
//=======================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;