"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loopback = require("loopback");
var FftodayTools = (function () {
    function FftodayTools() {
    }
    FftodayTools.appendIdsToPlayerModel = function (first_name, last_name, fftoday_id) {
        return new Promise(function (resolve, reject) {
            FftodayTools.app.models.Player.upsertWithWhere({
                first_name: first_name,
                last_name: last_name
            }, {
                fftoday_id: fftoday_id
            }, function (err, object) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(object);
                }
            });
        });
    };
    return FftodayTools;
}());
FftodayTools.baseUrl = 'http://www.fftoday.com/';
FftodayTools.app = loopback();
FftodayTools.outletId = 3;
exports.FftodayTools = FftodayTools;
;
//# sourceMappingURL=index.js.map