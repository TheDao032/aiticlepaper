const db = require(`../utils/db`);
const TBL_TAG = `tag`;

module.exports = ({
    all: _ => db.load(`select * from ${TBL_TAG}`),
    add: (entity) => db.add(TBL_TAG, entity),
    addWithName: async function(name){
       return await db.load(`INSERT INTO ${TBL_TAG} (name) VALUES ('${name}')`)
    },
    isExists : async function(tag)
    {
        rows =  await db.load(`select * from ${TBL_TAG} where name = '${tag}'`);
        if (rows.length === 0)
            return false
        return true
    },
    findByName : async function(name)
    {
        rows =  await db.load(`select * from ${TBL_TAG} where name = '${name}'`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    loadByIDArticle: async function(idArt)
    {
        rows =  await db.load(`select t.*, at.id as idAT from ${TBL_TAG} t join articleTag at on t.id = at.idTag where idArt = ${idArt}`);
        if (rows.length === 0)
            return null
        return rows
    },
  single: function (id) {
    return db.load(`select * from ${TBL_TAG} where id = ${id}`);
  },
  patch: function (entity) {
    const condition = {
      id: entity.id
    }
    delete entity.id;
    return db.patch(TBL_TAG, entity, condition);
  },
  del: function (id) {
    const condition = {
      id: id
    }
    return db.del(TBL_TAG, condition);
  },
  existTag: async function (id, name) {
    var rows = await db.load(
      `select * from ${TBL_TAG} where id != ${id} and name = '${name}'`
    );
    if (rows.length == 0) return true;
    return false;
  },
});

