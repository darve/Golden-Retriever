
const
    express             = require('express'),
    app                 = express(),
    path                = require('path'),
    bodyparser          = require('body-parser'),
    fs                  = require('fs'),
    cors                = require('cors');

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyparser.json({ limit: '50mb' }));

app.post('/save', (req, res, next) => {
    fs.writeFileSync(`./exports/${Date.now()}-${req.body.filename}.svg`, req.body.svg);
    res.send('cheers m8');
});

app.post('/frame', (req, res, next) => {
    var buf = new Buffer(req.body.png.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    fs.writeFileSync(`./gif-frames/${req.body.filename}${req.body.frame}.png`, buf);
    res.send('cheers m8');
});

var port = 3001;
app.listen(port);
console.log('server listening on port', + port);
