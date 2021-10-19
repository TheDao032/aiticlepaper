const db = require('../utils/db');
const TBL_ACCOUNT = 'account';

module.exports = {
    findByID: async function (id) {
        rows = await db.load(`select * from ${TBL_ACCOUNT} where id = ${id} and isDelete = 0`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    findByUsername: async function (username) {
        rows =  await db.load(`select * from ${TBL_ACCOUNT} where username = '${username}' and isDelete = 0`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    validPassword : async function(username, password)
    {
        rows = await db.load(`select * from ${TBL_ACCOUNT} where username = '${username}' and password = '${password}' and isDelete = 0`);
        if (rows.length === 0)
            return false
        return true
    },
    findByFacebookID : async function(facebookID)
    {
        rows =  await db.load(`select * from ${TBL_ACCOUNT} where idFacebook = '${facebookID}' and isDelete = 0`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    addFacebookUser : async function(userInfo)
    {
        return await db.add(TBL_ACCOUNT, userInfo)
    },
    findByGoogleID : async function(googleID)
    {
        rows =  await db.load(`select * from ${TBL_ACCOUNT} where idGoogle = '${googleID}' and isDelete = 0`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    addGoogleUser : async function(userInfo)
    {
        return await db.add(TBL_ACCOUNT, userInfo)
    },
    addAcc : async function(userInfo)
    {
        return await db.add(TBL_ACCOUNT, userInfo)
    },
    passwordChange : async function(entity, condition)
    {
        return await db.patch(TBL_ACCOUNT,entity, condition)
    },
    update : async function(entity, condition)
    {
        return await db.patch(TBL_ACCOUNT, entity, condition)
    },

}