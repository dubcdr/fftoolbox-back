"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var osmosis = require("osmosis");
var FftodayQbScrape = (function () {
    function FftodayQbScrape() {
        this.projSeasStatUrl = 'http://www.fftoday.com/rankings/playerproj.php?Season=2017&PosID=10';
        this.osmosis = osmosis({});
        this.limit = 5;
    }
    FftodayQbScrape.prototype.scrapeQbs = function () {
        this.osmosis.get(this.projSeasStatUrl)
            .find("body > center > table:nth-child(3) > tbody > tr:nth-child(2) > td.bodycontent > table:nth-child(12) > tbody > tr[class=\"\"]:limit(" + this.limit + ")")
            .set({
            'name': 'td:nth-child(2) > a',
            'team': 'td:nth-child(3)',
            'bye': 'td:nth-child(4)',
            'ps_comp': 'td:nth-child(5)',
            'ps_att': 'td:nth-child(6)',
            'ps_yd': 'td:nth-child(7)',
            'ps_td': 'td:nth-child(8)',
            'int': 'td:nth-child(8)',
            'ru_att': 'td:nth-child(8)',
            'ru_yd': 'td:nth-child(8)',
            'ru_td': 'td:nth-child(8)'
        })
            .data(function (response) {
            console.log(response);
        });
    };
    FftodayQbScrape.prototype.getQbData = function () {
    };
    return FftodayQbScrape;
}());
exports.FftodayQbScrape = FftodayQbScrape;
var test = new FftodayQbScrape();
test.scrapeQbs();
//# sourceMappingURL=scrapeQbs.js.map