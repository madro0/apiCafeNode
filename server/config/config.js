//=======================================
//PUERTO!
//=======================================

const { identity } = require("underscore");

process.env.PORT = process.env.PORT || 8887;


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

process.env.CADUCIDAD_TOKEN = '48h';

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

//=======================================
//Google client ID!
//=======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '861169619884-bqc58vbhfv406ck4rdf893ar8597003t.apps.googleusercontent.com';