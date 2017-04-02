var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var http = require('http');

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

/** Serving from the same express Server
 No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
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
        console.log(req.file.filename);


//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//python

        var PythonShell = require('python-shell');

        var options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: ['--img_fn', 'uploads/' + req.file.filename, '--out_fn', 'res/' + req.file.filename, '--gpu', '0']
        };

        PythonShell.run('forward.py', options, function (err, results) {
            if (err) throw err;
            console.log('results: %j', results);

            fs.readFile('res/' + req.file.filename, function (err, data) {
                if (err) console.log('file not found'); // Fail if the file can't be read.
                http.createServer(function (req, res) {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(data); // Send the file data to the browser.
                }).listen(3002);
                console.log('Image successfully treated');
            });

        });


//envoyer le resulta


//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

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
