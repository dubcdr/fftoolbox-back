'use strict';

module.exports = function (Basestat) {
  Basestat.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      ctx.instance.createdOn = new Date();
    }
    ctx.instance.modifiedOn = new Date();
    next();
  });
};
