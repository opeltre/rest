/* rest.js

usage:
    app.use('/rest', rest.serve('myDir'));
or:    
    serveMyDir = rest.serve('myDir')
        .as('/rest')
        .view(stats => html(stats));
    app.use('/rest', serveMyDir);
*/

const fs = require('fs').promises,
    path = require('path');

console.log(__dirname);
console.log(fs);

const pathfrom = dir => dir[0] == '/'
    ? relname => path.join(dir, relname)
    : relname => path.join(__dirname, dir, relname);

const _f = name => fs
    .stat(name)
    .then(stat => stat.isFile());

const repr = name => _f(name)
    .then(_f => ({name, _f}));

const ls = dir => fs
    .readdir(dir)
    .then(relnames => relnames.map(pathfrom(dir)))
    .then(names => Promise
        .all(names.map(repr))
    );

exports.serve = function (dir, view) {
   
    var dir = dir;
    var view = view || viewDefault;
    var dirAlias = dir;

    function my (req, res) {
        var name = pathfrom(dir)(req.params[0]);
        console.log(name);
        return _f(name)
            .then(isFile => isFile
                ? res.sendFile(name)
                : ls(name)
                    .then(my.alias)
                    .then(view)
                    .then(html => res.send(html))
            )
            .catch(console.log);
    }

    my.alias = stats => stats
        .map(({name, _f}) => ({
            name : name.replace(pathfrom(dir)('.'), dirAlias),
            _f : _f
        }));

    my.view = v => {
        view = v;
        return my;
    }

    my.as = mountpoint => {
        dirAlias = mountpoint;
        return my;
    }

    return my;
    
}

function viewDefault (stats) {
    return stats
        .map(s => 
            `<div>` +
            `<a href="${s.name}" style="color: ${s._f ? '#555' : '#000'}">` +
            `${s.name.replace(/^.*\//,'')}` +
            `</a></div>`
        )
        .join('\n');
}

/*
const ls = (path) => new 
    Promise((resolve, reject) => fs
        .readdir(path, (err,data) => err
            ? reject(err)
            : resolve(data)
        )
    );
*/

/*
const ls = (path) => fs.promises
    .readdir(path) 
    .then(
*/
