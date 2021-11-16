const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static('public'));


/////===================================================

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
const passport = require('./middlewares/auth.mdw')
    //require('./middlewares/role.mdw')(app);

//=====================================================
app.use(passport.initialize());
app.use(passport.session());
//======================================================

require('./middlewares/local.mdw')(app)

//=========================
const destrictWriter = require('./middlewares/roleWriter.mdw')
const destrictEditor = require('./middlewares/roleEditor.mdw')
const destrictSubscriber = require('./middlewares/roleSubscriber.mdw')
const destrictAdmin = require('./middlewares/roleAdministrator.mdw')
//=========================
// app.get('/', function(req, res){
//     res.redirect('/general/article')
// //   res.render('general/article', {layout: false})
// })

app.use(`/`, require(`./routes/general.route`));
app.use('/account', require('./routes/account.route'));
app.use(`/writer`,destrictWriter, require(`./routes/writer.route`));
app.use(`/editor`,destrictEditor, require(`./routes/editor.route`));
app.use(`/subscriber`, destrictSubscriber, require(`./routes/subscriber.route`));
app.use('/admin',destrictAdmin, require('./routes/admin.route'));


//=======================================================

app.get('/err', function(req, res) {
    throw new Error('beng beng');
})

app.use(function(req, res) {
    res.render('404', { layout: false });
})

app.use(function(err, req, res, next) {
    console.log(err)
    console.error(err.stack);
    res.status(500).render('500', { layout: false });
})

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at ${process.env.PORT}`);
})
