const User = require('../models/account.model');
const informationUser = require('../models/informationUser.model'); 
const config = require('../config/default.json')
const articleModel = require('../models/article.model')
module.exports = function (app) {
    app.use(async function (req, res, next) {
      //Cập nhật bài viết đến giờ xuất bản
      articleModel.updateByReleaseByIDStatusAll(config.statusArticle.released)
     if (req.isAuthenticated())
     {
        var user = await User.findByID(req.session.passport.user.id)
         delete user.password

         if (user.idFacebook || user.idGoogle)
            res.locals.lcAllowChangePassword = false
         else 
            res.locals.lcAllowChangePassword = true

        res.locals.lcIsAuthenticated = true
        res.locals.lcAuthUser = user
        res.locals.lcAuthUser.username = res.locals.lcAuthUser.username.toUpperCase()
        if (user.idRole == config.role.idSubscriber)
            res.locals.lcSubscriberFlag = true
         else if (user.idRole == config.role.idWriter)
            res.locals.lcWriterFlag = true
         else if (req.session.passport.user.idRole == config.role.idEditor)
            res.locals.lcEditorFlag = true
         else if (user.idRole == config.role.idAdmin)
            res.locals.lcAdministratorFlag = true
     }
     else
     {
        req.logout()
        res.locals.lcIsAuthenticated = false;
        res.locals.lcAuthUser = null
     }
      next();
    })
  }
  