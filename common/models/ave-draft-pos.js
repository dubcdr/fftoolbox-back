'use strict';

module.exports = function (Avedraftpos) {
  Avedraftpos.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance.modifiedOn = new Date();
      if (ctx.instance.createdOn == null) {
        ctx.instance.createdOn = new Date();
      }
    } else {
      ctx.data.modifiedOn = new Date();
    }
    next();
  });
};
