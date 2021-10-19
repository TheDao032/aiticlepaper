const db = require(`../utils/db`);
const TBL_CATEGORYMANAGE = `categorymanage`;

module.exports = {
  catManage: function (idAcc) {
    return db.load(
      `SELECT * FROM ${TBL_CATEGORYMANAGE} cm WHERE cm.idAcc = ${idAcc}`
    );
  },
  del: function (idAcc) {
    const condition = {
      idAcc: idAcc,
    };
    return db.del(TBL_CATEGORYMANAGE, condition);
  },
  add: (entity) => db.add(TBL_CATEGORYMANAGE, entity),
};
