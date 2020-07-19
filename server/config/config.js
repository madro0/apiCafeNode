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
//Base de datos!
//=======================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;