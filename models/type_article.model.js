const  db = require(`../utils/db`);
const TBL_TYPE = `typeofarticle`;

module.exports = ({
    all: _ => db.load(`select * from ${TBL_TYPE}`)
});
