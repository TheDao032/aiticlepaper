const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');

module.exports = function (app) {
  app.set('trust proxy', 1) // trust first proxy
  app.use(cookieParser())
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
    //   maxAge: 60000,
    //   secure: true
    }
  }))
  app.use(flash())
  app.get('/flash', function(req, res){
    req.flash('meLogin', 'Tên đăng nhập hoặc mật khẩu không đúng')
    res.redirect('/account/login');
  });
}
