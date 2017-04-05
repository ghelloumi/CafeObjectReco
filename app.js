var express = require('express');
var app = express();
var multer = require('multer');
var fs = require('fs');
var http = require('http');
var PythonShell = require('python-shell');
var name;
var n;
var bodyParser = require("body-parser");

//for number alea
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
        });


        //generer un url pourl'image dans res généré par python
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

//number alea

app.post('/numb', function(req, res){
    console.log('Got data');
    console.log(JSON.stringify(req.body.number));
    n=('IMG'+JSON.stringify(req.body.number)+'.jpg').replace('"','').replace('"','');
    app.get('/' + n, function (req, res) {//get,put,post,delete
        res.sendfile('JPEGImages/' + n);
    });

    console.log(n)
});


app.listen('3001', function () {
    console.log('running on 3001...');
});
