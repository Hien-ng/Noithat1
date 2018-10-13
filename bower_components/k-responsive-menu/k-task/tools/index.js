var express = require('express'),
    server = express(),
    pub = __dirname + '/static/',
    views = __dirname + '/views',
    bodyParser = require('body-parser'),
    html2jade;

try {
	html2jade = require('html2jade');
} catch (err) {
	console.log('Failure to load \'html2jade\' module');
	html2jade = require('./node_modules/html2jade/lib/html2jade')
}

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(pub));
server.set('view engine', 'jade');
server.set('views', views);

server.post('/convert', function (req, res) {
	var html = req.body.html;

    html2jade.convertHtml(html, {}, function (err, jade) {
        res.json({ jade: jade });
    });
});

server.get('/', function (req, res) {
    res.render('index.html');
});

server.listen(process.env.PORT || 9999, function () {
  console.log('HTML2PUG app listening on port 9999!');
  require("openurl").open("http://localhost:9999")
});