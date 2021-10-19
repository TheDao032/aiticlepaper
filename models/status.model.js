const db = require(`../utils/db`);
const TBL_STATUS = `status`;

module.exports = ({
    all: _ => db.load(`select * from ${TBL_STATUS}`),
    add: (entity) => db.add(TBL_STATUS, entity),
    single: (id) => db.load(`select * from ${TBL_STATUS} where id = ${id}`),
});
