// app/index.js 

const express = require('express'),
    path = require('path'),
    rest = require('./rest');

const STATIC = ['images', '.']

var app = express.Router(),
    bib = rest.serve('bib').as('');
    
app.get('/*', bib) 

/*** static ***/
STATIC.forEach(dir => app.use(
    dir.replace(/^\W*/,'/'), 
    express.static(path.join(__dirname, dir))
));

module.exports = app;
