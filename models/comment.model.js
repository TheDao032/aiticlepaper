const db = require("../utils/db");

const TBL_COMMENT = "comment";

module.exports = {
    add: function (entity) {
        return db.add('comment', entity)
    }
};