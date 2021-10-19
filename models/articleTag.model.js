const db = require(`../utils/db`);
const TBL_ARTICLETAG = `articletag`;

module.exports = ({
    addWithIDArtTag :  async function(idArt, idTag){
        return await db.load(`INSERT INTO ${TBL_ARTICLETAG} (idArt, idTag) VALUES ('${idArt}', '${idTag}')`)
     },
    deleteByID: async function(condition){
        return await db.del(TBL_ARTICLETAG, condition)
    },
    findByIDArtTag :  async function(idArt, idTag){
        var rows =  await db.load(`SELECT * FROM ${TBL_ARTICLETAG} WHERE idArt = ${idArt} and idTag = ${idTag}`)
        if (rows.length == 0)
            return null
        else
            return rows[0]
     },
    findByIDArt : async function(idArt){
        var rows =  await db.load(`SELECT * FROM ${TBL_ARTICLETAG} WHERE idArt = ${idArt}`)
        if (rows.length == 0)
            return null
        else
            return rows
     },
});