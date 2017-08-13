'use strict';

module.exports = function (Player) {
  Player.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      ctx.instance.createdOn = new Date();
    }
    next();
  });

  Player.observe('after save', (ctx, next) => {
    ctx.instance.modifiedOn = new Date();
    next();
  })
};
