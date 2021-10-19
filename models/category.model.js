const db = require("../utils/db");

const TBL_CATEGORY = "category";

module.exports = {
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORY} where id = ${id} and isDelete = 0`);
  },

  name: function (id) {
    return db.load(
      `select * from ${TBL_CATEGORY} where id = ${id} and idParent = id and isDelete = 0`
    );
  },

  add: (entity) => db.add(TBL_CATEGORY, entity),
  patch: function (entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;
    return db.patch(TBL_CATEGORY, entity, condition);
  },
  del: function (id) {
    const condition = {
      id: id,
    };
    return db.del(TBL_CATEGORY, condition);
  },
 
  get_parent_cat: (_) => db.load(`select * from ${TBL_CATEGORY} where idParent = id and isDelete = 0`),
  getAllCat: (_) => db.load(`select * from ${TBL_CATEGORY} where isDelete = 0`),
  all: function () {
    return db.load(`select * from ${TBL_CATEGORY} c where c.isDelete = 0 and c.idParent not in (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`);
  },

  root: function () {
    return db.load(`select * from ${TBL_CATEGORY} where idParent = id and isDelete = 0`);
  },

  findByName: async function (name) {
    var rows = await db.load(`select * from ${TBL_CATEGORY} where name = ${name} and isDelete = 0`);
    if (rows.length === 0) return null;
    return rows[0];
  },

  test: (_) => db.load(`SELECT max(id) + 1 as newID from ${TBL_CATEGORY}`),

  delete: function (id) {
    const condition = {
      id,
    };
    const entity = {
      isDelete: 1,
    };
    return db.patch(TBL_CATEGORY, entity, condition);
  },
  checkIDParent: async function (id) {
     var rows = await db.load(
      `select * from ${TBL_CATEGORY} where id = idParent and id = ${id}`
    );
    if (rows.length == 0) return false;
    return true;
  },
  existCategory: async function (id, name) {
    var rows = await db.load(
      `select * from ${TBL_CATEGORY} where id != ${id} and name = '${name}'`
    );
    if (rows.length == 0) return true;
    return false;
  },
  existNameCategory: async function (name) {
    var rows = await db.load(
      `select * from ${TBL_CATEGORY} c where c.name = '${name}' and c.isDelete = 0 and c.idParent not in (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`
    );
    if (rows.length == 0) return true;
    return false;
  },
  existNameCategoryInAll: async function (name) {
    var rows = await db.load(
      `select * from ${TBL_CATEGORY} c where c.name = '${name}'`
    );
    if (rows.length == 0) return null;
    return rows[0];
  },
};
