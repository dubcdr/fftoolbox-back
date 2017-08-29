'use strict';

module.exports = function (Player) {
  Player.observe('before save', (ctx, next) => {
    if (ctx.instance !== undefined) {
      console.log('instance, beforeSave player', ctx.instance);
      if (ctx.instance.createdOn == null) {
        ctx.instance.createdOn = new Date();
      }
      ctx.instance.modifiedOn = new Date();
    }
    next();
  })
};
