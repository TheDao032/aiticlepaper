const config = require('../config/default.json')
module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    // return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    return res.redirect(`/err`);
  } else {
    if (req.session.passport.user.idRole != config.role.idWriter) 
      return res.redirect(`/err`);
  }
  next();
};
