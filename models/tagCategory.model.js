const db = require(`../utils/db`);
const TBL_TAGCATEGORY = `tagcategory`;

module.exports = ({
    findByIDCatTag : async function(idCat, idTag)
    {
        rows =  await db.load(`select * from ${TBL_TAGCATEGORY} where idTag = '${idTag}' and idCat = '${idCat}'`);
        if (rows.length === 0)
            return null
        return rows[0]
    }, 
    addWithIDCatTag :  async function(idCat, idTag){
        return await db.load(`INSERT INTO ${TBL_TAGCATEGORY} (idCat, idTag) VALUES ('${idCat}', '${idTag}')`)
     },
});
