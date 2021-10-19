const db = require('../utils/db');

const TBL_ACCOUNTS = "account";

module.exports = {
    allExceptAdmin: function(idRoleAdmin) {
        return db.load(`select *, a.id as idAcc, i.id as idInfo from account a LEFT join informationuser i on a.id = i.idAcc join role r on a.idRole = r.id where a.idRole != ${idRoleAdmin} and a.isDelete = 0`);
    },
    single: function(id) {
        return db.load(`select a.*, i.fullName from ${TBL_ACCOUNTS} a join informationuser i on a.id = i.idAcc where a.id = ${id}`);
    },

    add: function(entity) {
        return db.add(TBL_ACCOUNTS, entity);
    },

    patch: function(entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_ACCOUNTS, entity, condition);
    },
    del: function(id) {
        const condition = {
            id: id
        }
        return db.del(TBL_ACCOUNTS, condition);
    },
    delete: function(idAcc)
    {
        const condition = {
            id: idAcc
        }
        const entity = {
            isDelete : 1
        }
        return db.patch(TBL_ACCOUNTS, entity,condition)
    }
};