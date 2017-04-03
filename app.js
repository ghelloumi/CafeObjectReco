var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var http = require('http');

var name;
var d;
var str


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
            str='results: %j', results;

            name = req.file.filename;

            fs.readFile('res/' + req.file.filename, function (err, data) {
                if (err) console.log('file not found'); // Fail if the file can't be read.
                d = data;
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


app.post('/recon', function (req, res) {


    var server=http.createServer(function (req, res) {
         res.writeHead(200, {'Content-Type': 'image/jpeg'});
         res.end(d); // Send the file data to the browser.
    }).listen(3002);
    console.log('Image successfully treated');


    http.get({host: "localhost", port: "3002"}, function (res) {
        if (res.statusCode == 200) {
            console.log("This site is up and running!");

            setTimeout(function(){server.close()},3000);
            console.log('ok closed');
        }

        else
            console.log("This site might be down " + res.statusCode);
    });

});

app.listen('3001', function () {
    console.log('running on 3001...');
});