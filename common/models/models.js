var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));

var players = {
  "name": "Player",
  "options": {
    "idInjection": true,
    "postgres": {
      "schema": "FFTOOLBOX",
      "table": "PLAYER"
    }
  },
  "properties": {
    "first_name": {
      "type": "String",
      "required": true,
      "length": 40
    },
    "last_name": {
      "type": "String",
      "required": true,
      "length": 40
    },
    "suffix": {
      "type": "String",
      "length": 5,
      "required": false
    },
    "position": {
      "type": "String",
      "length": 10,
      "required": true,
    },
    "teamId": {
      "type": "string",
      "length": 5
    }
  }
};

var ds = app.dataSources.postgres;

// ds.createModel(players.name, players.properties, players.options);

ds.automigrate();
