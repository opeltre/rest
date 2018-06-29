var srv = require('express')(),
    vhost = require('vhost'),
    proxy = require('express-http-proxy'),
    app = require('./app.js');

srv.use(vhost('rest.peltre.xyz', app));
srv.use(vhost('pi.peltre.xyz', proxy('81.220.82.13')));

srv.listen(80);
