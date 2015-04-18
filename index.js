// jshint esnext:true
var mandrill    = require('node-mandrill')(
        process.env.MANDRILL_APIKEY
    ),
    mongoUri    = process.env.MONGOLAB_URI || 
        process.env.MONGOHQ_URL || 
        'mongodb://localhost/emory',
    mongoose    = require('mongoose'),
    fs          = require('fs'),
    pkg         = JSON.parse(fs.readFileSync('./package.json')),
    koa         = require('koa'),
    compress    = require('koa-compress'),
    route       = require('koa-route'),
    koaBody     = require('koa-better-body'),
    app         = koa();

mongoose.connect(mongoUri);
app.use(require('koa-static')(__dirname + '/public'));
app.use(compress());
app.use(koaBody());

// logger
app.use(function *(next){
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

require('./routes/url')(app, route);

app.listen(process.env.PORT || 3001);
console.log(pkg.name, 'listening');
