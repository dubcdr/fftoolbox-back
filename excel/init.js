var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.dataSources.postgres;

var fs = require('fs');
var csv = require('csv');

/**
 * NFL Team Initialization
 */

let file = path.resolve(__dirname, 'teams.csv');
console.log('NFL Team File', file);

let teamOutput = [];
let parse = csv.parse({
  delimiter: ','
}, (err, data) => {
  teamOutput = data;
  teamOutput.splice(0, 1);
  teamOutput.forEach((line) => {
    let insert = parseTeam(line);
    app.models.NflTeam.create(insert).then((response) => {
      console.log(response);
    });
  });
})

function parseTeam(json) {
  return {
    abbr: json[0],
    city: json[1],
    name: json[2],
    conf: json[3],
    div: json[4],
    id: json[5]
  }
}

fs.createReadStream(file).pipe(parse);

/***** End of Nfl Team Init *****/
