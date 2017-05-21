var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));

var ds = app.dataSources.postgres;

// ds.createModel(players.name, players.properties, players.options);

ds.automigrate();
// ds.autoupdate();
