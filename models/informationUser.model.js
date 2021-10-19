const db = require('../utils/db');
const TBL_INFORMATIONUSER = 'informationuser';

module.exports = {
    add: async function (informationUser) {
        return await db.add(TBL_INFORMATIONUSER, informationUser)
    },
    findByUsername : async function(username){
        rows = await db.load(`select i.*, a.username, a.expiredPre, a.idRole , DATE_FORMAT(i.DOB, "%d/%m/%Y") as dob from ${TBL_INFORMATIONUSER} i join account a on i.idAcc = a.id where a.username = '${username}' and a.isDelete = 0`)
        if (rows.length === 0)
            return null
        return rows[0]
    }, 
    update : async function(entity, condition)
    {
        return await db.patch(TBL_INFORMATIONUSER, entity, condition)
    },
}