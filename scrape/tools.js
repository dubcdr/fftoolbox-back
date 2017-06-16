const prompt = require('prompt');


class FftoolboxUtility {
  constructor() {
    this.Players = app.models.Player
  }

  findPlayerIdByFirstLast(first_name, last_name) {
    return new Promise((resolve, reject) => {
      this.Players.find({
        where: {
          first_name,
          last_name
        }
      }).then((response) => {
        if (response.length === 0) {
          console.log(`There were no results for ${first_name} ${last_name}`);
          console.log(`Enter 'quit' to exit or the id to continue`);
          prompt.start();
          prompt.get(['id'], (err, result) => {
            this.Players.find({
              where: {
                id: result.id
              }
            }).then((response) => {
              if (response.length === 1) {
                resolve(result.id);
              } else {
                process.exit(1);
              }
            })
          })
        } else if (response.length > 1) {
          console.log(`Multiple results were returned for ${first_name} ${last_name}`);
          console.log(response);
          console.log('Enter the zero based index of desired or -1 to exit');
          prompt.start();
          prompt.get(['index'], (err, result) => {
            if (parseInt(result.index) === -1) {
              process.exit(1);
            } else {
              resolve(response[parseInt(result.index)].id);
            }
          })
        } else {
          console.log(response[0]);
          resolve(response[0].id);
        }
      });
    })
  }
}

module.exports = {
  FftoolboxUtility
};
