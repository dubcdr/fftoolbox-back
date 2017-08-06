import osmosis = require('osmosis');
import { FftodayTools } from './';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';

const app = require('./../../server/server');

export class FftodayQbScrape extends FftodayTools {
  public projSeasStatUrl = 'http://www.fftoday.com/rankings/playerproj.php?Season=2017&PosID=10&LeagueID=17';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = 50;

  constructor() {
    super();
  }

  public async testApp() {
    this.scrapeQbs()
  }

  public scrapeQbs() {
    this.osmosis.get(this.projSeasStatUrl)
      .find(`body`)
      .set({
        'dateString': '.update'
      })
      .find(`td.bodycontent > table:last-of-type table tr:not(.tablehdr):not(.tableclmhdr):limit(${this.limit})`)
      .set({
        'name': 'td:nth-child(2) > a',
        'name_link': 'td:nth-child(2) > a > @href',
        'team': 'td:nth-child(3)',
        'bye': 'td:nth-child(4)',
        'ps_cmp': 'td:nth-child(5)',
        'ps_att': 'td:nth-child(6)',
        'ps_yd': 'td:nth-child(7)',
        'ps_td': 'td:nth-child(8)',
        'int': 'td:nth-child(9)',
        'ru_att': 'td:nth-child(10)',
        'ru_yd': 'td:nth-child(11)',
        'ru_td': 'td:nth-child(12)',
        'fantasy_pts': 'td:nth-child(13)'
      })
      .data((response: IScrapeQbResponse) => {
        this.parseQbData(response);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  }

  public async parseQbData(obj: IScrapeQbResponse): Promise<Fftoolbox.IProjOffSeasStat> {
    let name = FftodayTools.parseName(obj.name);
    let fftodayId = FftodayTools.getFftodayIdFromLink(obj.name_link);

    let playerId = await this.findPlayerIdByFirstLast(name.first, name.last);
    let projDate = FftodayTools.parseDate(obj.dateString);

    if (!(playerId > 0)) {
      console.log('need to make player for', obj);
      let player: Fftoolbox.IPlayer = {
        first_name: name.first,
        last_name: name.last,
        position: 'QB',
        teamId: this.nflTeams[obj.team].id,
        fftodayId: fftodayId,
      }
      let where = {
        first_name: name.first,
        last_name: name.last
      }
      player = await this.playerUpsertWithWhere(where, player);
      console.log('Player Inserted', player);
      if (player && player.id) {
        playerId = player.id;
      };
    }

    await this.appendIdsToPlayerModel(name.first, name.last, fftodayId);

    let data: Fftoolbox.IProjOffSeasStat = {
      date: projDate.toDate(),
      year: 2017,
      outletId: Fftoolbox.EOutlets.fftoday,
      fantasy_pts: Fftoolbox.Utilities.parseStatToInt(obj.fantasy_pts),
      ps_att: Fftoolbox.Utilities.parseStatToInt(obj.ps_att),
      ps_cmp: Fftoolbox.Utilities.parseStatToInt(obj.ps_cmp),
      ps_td: Fftoolbox.Utilities.parseStatToInt(obj.ps_td),
      ps_yd: Fftoolbox.Utilities.parseStatToInt(obj.ps_yd),
      int: Fftoolbox.Utilities.parseStatToInt(obj.int),
      playerId,
      ru_att: Fftoolbox.Utilities.parseStatToInt(obj.ru_att),
      ru_td: Fftoolbox.Utilities.parseStatToInt(obj.ru_td),
      ru_yd: Fftoolbox.Utilities.parseStatToInt(obj.ru_yd),
      teamId: this.getTeam(obj.team)
    }

    let filter = {
      where: {
        year: data.year,
        outletId: data.outletId,
        playerId,
        date: {
          gt: projDate.subtract(2, 'd').toDate(),
          lt: projDate.add(2, 'd').toDate()
        }
      }
    }

    let projSeason = await this.projSeasonFindOrCreate(filter, data);

    return data;
  }
}

interface IScrapeQbResponse {
  dateString: string;
  name: string;
  name_link: string;
  team: string;
  bye: string;
  ps_cmp: string;
  ps_att: string;
  ps_yd: string;
  ps_td: string;
  int: string;
  ru_att: string;
  ru_yd: string;
  ru_td: string;
  fantasy_pts: string;
}

let test = new FftodayQbScrape();
test.testApp();
