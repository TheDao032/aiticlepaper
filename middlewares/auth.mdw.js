const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/account.model');
const config = require('../config/default.json');
const bcrypt = require('bcryptjs');
const informationUserModel = require('../models/informationUser.model')



passport.use(new LocalStrategy(
  async function (username, password, done) {
    try{
      const user = await User.findByUsername(username);
      if (!user)
      {
        return done(null, false);
      }
      else{
        const result = bcrypt.compareSync(password, user.password);
        if (result === true)
        {
          delete user.password
          return done(null, user)
        }
        else
          return done(null, false)   
      }
    }catch(err)
    {
      return done(err)
    }    
  }
));
//==============================================
passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL,
  enableProof: true,
  profileFields: ['id', 'email', 'displayName', 'gender', 'birthday']
},
async function(accessToken, refreshToken, profile, done) {
  try{
    var user = await User.findByFacebookID(profile._json.id);
    if (!user)
    {
      let userInfo = {
        "idFacebook" : profile._json.id,
        "username" : profile._json.name,
        accessToken,
        refreshToken
      }
      await User.addFacebookUser(userInfo)
      user = await User.findByFacebookID(profile._json.id);

      let info = {
        fullName : profile._json.name,
        idAcc : user.id
      }
      informationUserModel.add(info)

      //Check nếu có email đồ thì thêm vào nữa 
      //Mai mượn nick tụi nó check
    }
    return done(null, user)
  }
  catch(err)
  {
    return done(err)
  }
}
));
//==============================================
passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL
},
async function(accessToken, refreshToken, profile, done) {
  try{
    var user = await User.findByGoogleID(profile._json.sub);
    if (!user)
    {
      let userInfo = {
        "idGoogle" : profile._json.sub,
        "username" : profile._json.family_name + " " + profile._json.given_name,
        accessToken,
        refreshToken
      }
      await User.addGoogleUser(userInfo)
      user = await User.findByGoogleID(profile._json.sub);

      let info = {
        fullName : profile._json.family_name + " " + profile._json.given_name,
        idAcc : user.id
      }
      informationUserModel.add(info)
    }
    return done(null, user)
  }
  catch(err)
  {
    return done(err)
  } 
}
));
//==============================================
passport.serializeUser(function(user, done) {
  done(null, user)
});

passport.deserializeUser(function(user, done){
  try{
    //const user = User.findByID(id);
    //delete user.password
    if (user)
      return done(null, user)
    else
      return done(null, false)
  }catch(err)
  {
    return done(err)
  }
 
});

module.exports = passport;