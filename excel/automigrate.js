var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.dataSources.postgres;


// ds.automigrate();
ds.autoupdate();
