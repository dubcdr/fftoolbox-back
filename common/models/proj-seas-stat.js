'use strict';

module.exports = function (Projseasstat) {
  Projseasstat.observe('after save', (ctx, next) => {
    if (ctx.instance.createdOn == null) {
      ctx.instance.createdOn = new Date();
    }
    ctx.instance.modifiedOn = new Date();
    next();
  });
};
