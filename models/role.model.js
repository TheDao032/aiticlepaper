const db = require('../utils/db');
const TBL_ROLE = 'role';

module.exports = {
    allExceptIDRole: function (idRole) {
        return db.load(`SELECT * FROM ${TBL_ROLE} WHERE id != ${idRole}`)
    },
}