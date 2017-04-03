var express = require('express');
var app = express();
var multer = require('multer');
var fs = require('fs');
var http = require('http');
var PythonShell = require('python-shell');
var name;


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        console.log(req.file);

        var options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: ['--img_fn', 'uploads/' + req.file.filename, '--out_fn', 'res/file-' + req.file.originalname, '--gpu', '0'] //
        };
        name ='file-'+req.file.originalname;

        PythonShell.run('forward.py', options, function (err, results) {
            if (err) throw err;
            console.log('results: %j', results);

            app.get('/index.html' + success, function (req, res) {//get,put,post,delete
                res.sendfile('res/index.html');
            });
        });

        app.get('/' + name, function (req, res) {//get,put,post,delete
            res.sendfile('res/' + name);
        });

        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    });
});


app.listen('3001', function () {
    console.log('running on 3001...');
});
