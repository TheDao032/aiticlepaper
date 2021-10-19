const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model')
const moment = require('moment')

router.post(`/assign`, async (req, res) => {
    let acc = await accountModel.findByUsername(req.body.username)
    var minutes = 60*24*7
    var a = new Date();
    a.setTime(a.getTime() + minutes*60*1000)
  
    let entity = {
        //expiredPre : d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        expiredPre : a
    }
    let condition = {
        id : acc.id
    }
    console.log(entity)
    await accountModel.update(entity, condition)
    res.redirect('/account/profile')
});

router.post(`/extend`, async (req, res) => {
    let acc = await accountModel.findByUsername(req.body.username)
    var minutes = 60*24*7
    var a = new Date();
    a.setTime(a.getTime() + minutes*60*1000)
  
    let entity = {
        //expiredPre : d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        expiredPre : a
    }
    let condition = {
        id : acc.id
    }
    console.log(entity)
    await accountModel.update(entity, condition)
    res.redirect('/account/profile')
});

module.exports = router;