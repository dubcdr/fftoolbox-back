var prompt = require('prompt');
var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var loopback = require('loopback');
var FftoolboxUtility = (function () {
    function FftoolboxUtility() {
        this.Players = app.models.Player;
    }
    FftoolboxUtility.prototype.findPlayerIdByFirstLast = function (first_name, last_name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.Players.find({
                where: {
                    first_name: first_name,
                    last_name: last_name
                }
            }).then(function (response) {
                if (response.length === 0) {
                    console.log("There were no results for " + first_name + " " + last_name);
                    console.log("Enter 'quit' to exit or the id to continue");
                    prompt.start();
                    prompt.get(['id'], function (err, result) {
                        _this.Players.find({
                            where: {
                                id: result.id
                            }
                        }).then(function (response) {
                            if (response.length === 1) {
                                resolve(result.id);
                            }
                            else {
                                process.exit(1);
                            }
                        });
                    });
                }
                else if (response.length > 1) {
                    console.log("Multiple results were returned for " + first_name + " " + last_name);
                    console.log(response);
                    console.log('Enter the zero based index of desired or -1 to exit');
                    prompt.start();
                    prompt.get(['index'], function (err, result) {
                        if (parseInt(result.index) === -1) {
                            process.exit(1);
                        }
                        else {
                            resolve(response[parseInt(result.index)].id);
                        }
                    });
                }
                else {
                    console.log(response[0]);
                    resolve(response[0].id);
                }
            });
        });
    };
    return FftoolboxUtility;
}());
module.exports = {
    FftoolboxUtility: FftoolboxUtility
};
//# sourceMappingURL=tools.js.map