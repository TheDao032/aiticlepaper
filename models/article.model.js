const db = require('../utils/db');
const TBL_ARTICLE = 'article';
const config = require('../config/default.json') 

module.exports = ({
    all: async () => await db.load(`select * from ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
/*    allWithDetails: _ => db.load(`Select`)*/
    add: (entity) => db.add(TBL_ARTICLE, entity),
    // getStatus: ()=>db.load(`Select distinct idStatus from ${TBL_ARTICLE}`),
    // getid: ()=>db.load(`Select id from ${TBL_ARTICLE}`),
    single: (id) => db.load(`select a.*, c.name as catName from ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.id = ${id} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    allDetails: _ => db.load(`select a.*, s.name as nameStatus, s.id as idStatus, c.name as CateName from ${TBL_ARTICLE} a join status s on a.idStatus = s.id join category c on a.idCat = c.id where a.isDelete = 0 and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    allPending: _ => db.load(`select a.*, s.name as nameStatus, s.id as idStatus, c.name as CateName from ${TBL_ARTICLE} a join status s on a.idStatus = s.id and s.id = ${config.statusArticle.isPending}
                                    join category c on c.id = a.idCat
                                    where a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
                                    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)
                                    order by a.datetime`),
//Mốt sửa thành cái này
//    select a.*, s.name as nameStatus, s.id as idStatus, c.name as CateName
//    from article a join status s on a.idStatus = s.id and s.id = 13
//    join category c on c.id = a.idCat join categorymanage cm on cm.idCat = c.id and c.id = 1
//    order by a.datetime

    allDetailsByIDAcc: (idAcc) => db.load(`select a.*, s.name as nameStatus, s.id as idStatus from ${TBL_ARTICLE} a join status s on a.idStatus = s.id join category c on c.id = a.idCat where a.idAcc = ${idAcc} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    allDetailByIDAccIDStatus: (idAcc, idStatus) => db.load(`select a.*, s.name as nameStatus, s.id as idStatus, c.name as CateName 
                                                            from ${TBL_ARTICLE} a join status s on a.idStatus = s.id
                                                                                    join category c on c.id = a.idCat
                                                                                    join categorymanage cm on cm.idCat = c.idParent
                                                            where a.idStatus = ${idStatus} and cm.idAcc = ${idAcc} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
                                                            (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)
                                                            order by a.datetime`),
    allDetailByIDAccIDStatusWriter : (idAcc, idStatus) => db.load(`select a.*, s.name as nameStatus, s.id as idStatus from ${TBL_ARTICLE} a join status s on a.idStatus = s.id join category c on c.id = a.idCat where a.idStatus = ${idStatus} and a.idAcc = ${idAcc} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    findByID: async function (id) {
        rows = await db.load(`select *, a.id as idArt from ${TBL_ARTICLE} a join category c on c.id = a.idCat where a.id = ${id} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
        (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    findByIDArtIDAcc : async function (idArt, idAcc) {
        rows = await db.load(`select *, a.id as idArt from ${TBL_ARTICLE} a join category c on c.id = a.idCat where a.id = ${idArt} and a.idAcc = ${idAcc} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
        (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`);
        if (rows.length === 0)
            return null
        return rows[0]
    },
    updateByReleaseByIDStatusAll: (idStatus) => db.load(`UPDATE article SET idStatus = ${idStatus} WHERE releaseTime <= NOW() and YEAR(releaseTime) != 1970`),
    updateByID: async (entity, condition) => await db.patch(TBL_ARTICLE, entity, condition),
    deleteByID: function(id){
        const condition = {
            id,
          };
          const entity = {
            isDelete: 1,
          };
          return db.patch(TBL_ARTICLE, entity, condition);
    },
    update: (entity, condition) => db.patch(TBL_ARTICLE, entity,condition),
    
    //newArticle: _ => db.load(`SELECT a.*, c.name as catName FROM ${TBL_ARTICLE} a join category c on a.idCat = c.id ORDER BY datetime DESC LIMIT 10`),
    //highlightsArticle: _=> db.load(`select a.*,c.name as catName from ${TBL_ARTICLE} a join category c on a.idCat = c.id ORDER BY view DESC LIMIT 5`),
    //topViewEachCate: _=> db.load(`SELECT a.*,c.name as nameCat, MAX(a.view) from ${TBL_ARTICLE} a join category c on a.idCat = c.id GROUP by c.id`),
    //cateParent: _=> db.load(`select id, name from category WHERE idParent = id`),
    //getCatebyIDParent: (idparent)=> db.load(`SELECT id ,name FROM category WHERE idParent = ${idparent} and id != ${idparent}`),
    getArtbyID : (ID) =>db.load(`select a.*,c.name as catName, DATE_FORMAT(a.releaseTime, "%d-%m-%Y") as rT from ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.id = ${ID} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    getAnotherArt :(IDCat, ID) =>db.load(`select a.* from ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.idCat = ${IDCat} AND a.id != ${ID} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY a.datetime LIMIT 5 `),
    getComtByID :(ID) =>db.load(`SELECT *, DATE_FORMAT(c.datetime, "%d-%m-%Y") as dt FROM comment c JOIN account a on c.idAcc = a.id WHERE c.idArt = ${ID} ORDER BY c.datetime DESC`),
    getListArtByIDCat :(IDCat,limit,offset) =>db.load(` SELECT * FROM article a join  category c on a.idCat = c.id where c.id = ${IDCat} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) LIMIT ${limit} OFFSET ${offset}`),
    getListArtByIDCatParent :(IDCat,limit,offset) =>db.load(` SELECT a.*, c.* FROM article a join  category c on a.idCat = c.id where c.idParent = ${IDCat} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) LIMIT ${limit} OFFSET ${offset}`),
    getListArtByIDCatPre :(IDCat,limit,offset) =>db.load(` SELECT * FROM article a join  category c on a.idCat = c.id where c.id = ${IDCat} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY a.datetime, a.idTOA DESC LIMIT ${limit} OFFSET ${offset}`),
    getListArtByIDCatPreParent :(IDCat,limit,offset) =>db.load(` SELECT * FROM article a join  category c on a.idCat = c.id where c.idParent = ${IDCat} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY a.datetime, a.idTOA DESC LIMIT ${limit} OFFSET ${offset}`),
    countByCat :(IDCat) =>db.load(`select count(*) as total from ${TBL_ARTICLE} a join category c on a.idCat = c.id WHERE c.id = ${IDCat} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) `),
    fullTextSearch :(search) =>db.load(`SELECT a.* from ${TBL_ARTICLE} a join category c on a.idCat = c.id WHERE MATCH(a.title,a.synopsis,a.content) against('${search}') and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1)`),
    fullTextSearchPre :(search) =>db.load(`SELECT a.* from ${TBL_ARTICLE} a join category c on a.idCat = c.id WHERE MATCH(a.title,a.synopsis,a.content) against('${search}') and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY datetime, idTOA DESC`),
    newArticle: _ => db.load(`SELECT a.*, c.name as catName,  DATE_FORMAT(a.releaseTime, "%d-%m-%Y") as rT FROM ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY datetime DESC LIMIT 10`),
    highlightsArticle: _=> db.load(`select a.*,c.name as catName, DATE_FORMAT(a.releaseTime, "%d-%m-%Y") as rT from ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY view DESC LIMIT 5`),
    topViewEachCate: _=> db.load(`SELECT *, DATE_FORMAT(releaseTime, "%d-%m-%Y") as rT
    FROM
    (SELECT aa.*, aa.isDelete as artDelete ,cc.idParent, cc.name as catName, cc.isDelete as catDelete
    FROM category cc JOIN ${TBL_ARTICLE} aa ON cc.id = aa.idCat join
        (SELECT max(a.datetime) as max, c.idParent as idParent
        FROM ${TBL_ARTICLE} a JOIN category c ON a.idCat = c.id
        GROUP BY c.idParent) as T
    where aa.datetime >= T.max and cc.idParent = T.idParent
    ORDER BY aa.view DESC
    LIMIT 10) as A
     join
    (SELECT SUM(aaa.view) as sumView, ccc.idParent
    FROM category ccc join ${TBL_ARTICLE} aaa on ccc.id = aaa.idCat
    GROUP BY ccc.idParent
    ORDER BY sumView DESC
    LIMIT 10) as B
    ON A.idParent = B.idParent
    where A.artDelete = 0 and A.catDelete = 0 and A.idStatus = 4 and A.idParent not in
    (select cccc.id from category cccc where cccc.id = A.idParent and cccc.isDelete = 1)
    GROUP BY B.idParent
    ORDER BY  sumView DESC, datetime DESC`),
    cateParent: _=> db.load(`select id, name from category WHERE idParent = id and isDelete = 0 limit 10`),
    cateParentAll: _=> db.load(`select id, name from category WHERE idParent = id and isDelete = 0`),
    getCatebyIDParent: (idparent)=> db.load(`SELECT id ,name FROM category WHERE idParent = ${idparent} and id != ${idparent} and isDelete = 0`),
    //getArtbyID : (ID) =>db.load(`select * from ${TBL_ARTICLE} where id = ${ID} and isDelete = 0`)
    topNewEachCate: _=> db.load(`SELECT *,  DATE_FORMAT(releaseTime, "%d-%m-%Y") as rT
    FROM
    (SELECT aa.*, aa.isDelete as artDelete ,cc.idParent, cc.name as catName, cc.isDelete as catDelete
    FROM category cc JOIN ${TBL_ARTICLE} aa ON cc.id = aa.idCat join
        (SELECT max(a.view) as max, c.idParent as idParent
        FROM ${TBL_ARTICLE} a JOIN category c ON a.idCat = c.id
        GROUP BY c.idParent) as T
    where aa.view >= T.max and cc.idParent = T.idParent
    ORDER BY aa.view DESC
    LIMIT 10) as A
     join
    (SELECT SUM(aaa.view) as sumView, ccc.idParent
    FROM category ccc join ${TBL_ARTICLE} aaa on ccc.id = aaa.idCat
    GROUP BY ccc.idParent
    ORDER BY sumView DESC
    LIMIT 10) as B
    ON A.idParent = B.idParent
    where A.artDelete = 0 and A.catDelete = 0 and A.idStatus = 4 and A.idParent not in
    (select cccc.id from category cccc where cccc.id = A.idParent and cccc.isDelete = 1)
    GROUP BY B.idParent
    ORDER BY  sumView DESC, view DESC`),
    newArticlePre: _=>db.load(`SELECT a.*, c.name as catName, DATE_FORMAT(a.releaseTime, "%d-%m-%Y") as rT FROM ${TBL_ARTICLE} a join category c on a.idCat = c.id where a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY datetime, idTOA DESC LIMIT 10`),
    highlightsArticlePre: _=> db.load(`select a.*,c.name as catName,  DATE_FORMAT(a.releaseTime, "%d-%m-%Y") as rT from ${TBL_ARTICLE} a join category c on a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
    (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) and c.isDelete = 0 ORDER BY view, idTOA DESC LIMIT 5`),
    topViewEachCatePre: _=> db.load(`SELECT *, DATE_FORMAT(releaseTime, "%d-%m-%Y") as rT
    FROM
    (SELECT aa.*, aa.isDelete as artDelete ,cc.idParent, cc.name as catName, cc.isDelete as catDelete
    FROM category cc JOIN ${TBL_ARTICLE} aa ON cc.id = aa.idCat join
        (SELECT max(a.datetime) as max, c.idParent as idParent
        FROM ${TBL_ARTICLE} a JOIN category c ON a.idCat = c.id
        GROUP BY c.idParent) as T
    where aa.datetime >= T.max and cc.idParent = T.idParent
    ORDER BY aa.view, aa.idTOA DESC
    LIMIT 10) as A
     join
    (SELECT SUM(aaa.view) as sumView, ccc.idParent
    FROM category ccc join ${TBL_ARTICLE} aaa on ccc.id = aaa.idCat
    GROUP BY ccc.idParent
    ORDER BY sumView DESC
    LIMIT 10) as B
    ON A.idParent = B.idParent
    where A.artDelete = 0 and A.catDelete = 0 and A.idStatus = 4 and A.idParent not in
    (select cccc.id from category cccc where cccc.id = A.idParent and cccc.isDelete = 1)
    GROUP BY B.idParent
    ORDER BY  sumView, idTOA DESC, datetime DESC`),
    topNewEachCatePre: _=> db.load(`SELECT *, DATE_FORMAT(releaseTime, "%d-%m-%Y") as rT
    FROM
    (SELECT aa.*, aa.isDelete as artDelete ,cc.idParent, cc.name as catName, cc.isDelete as catDelete
    FROM category cc JOIN ${TBL_ARTICLE} aa ON cc.id = aa.idCat join
        (SELECT max(a.view) as max, c.idParent as idParent
        FROM ${TBL_ARTICLE} a JOIN category c ON a.idCat = c.id
        GROUP BY c.idParent) as T
    where aa.view >= T.max and cc.idParent = T.idParent
    ORDER BY aa.view, aa.idTOA DESC
    LIMIT 10) as A
     join
    (SELECT SUM(aaa.view) as sumView, ccc.idParent
    FROM category ccc join ${TBL_ARTICLE} aaa on ccc.id = aaa.idCat
    GROUP BY ccc.idParent
    ORDER BY sumView DESC
    LIMIT 10) as B
    ON A.idParent = B.idParent
    where A.artDelete = 0 and A.catDelete = 0 and A.idStatus = 4 and A.idParent not in
    (select cccc.id from category cccc where cccc.id = A.idParent and cccc.isDelete = 1)
    GROUP BY B.idParent
    ORDER BY  sumView, idTOA DESC, view DESC`),
    findByIDTag : (idTag)=> db.load(`((SELECT a.* FROM ${TBL_ARTICLE} a join articletag a2 on a.id = a2.idArt join category c on c.id = a.idCat where a2.idTag = ${idTag} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
        (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY a.datetime)
    UNION
    (SELECT aa.* FROM article aa  join category ccc on aa.idCat = ccc.id WHERE aa.idStatus = ${config.statusArticle.released} and aa.isDelete = 0 and ccc.isDelete = 0 and ccc.idParent not in
        (select cccc.id from category cccc where cccc.id = ccc.idParent and cccc.isDelete = 1) and aa.idCat IN (
    SELECT tc.idCat FROM tagcategory tc where tc.idTag = ${idTag})
    ORDER BY aa.datetime)
    ORDER BY datetime
    LIMIT 5)`),
    findByIDTagPre : (idTag)=> db.load(`((SELECT a.* FROM ${TBL_ARTICLE} a join articletag a2 on a.id = a2.idArt join category c on c.id = a.idCat where a2.idTag = ${idTag} and a.idStatus = ${config.statusArticle.released} and a.isDelete = 0 and c.isDelete = 0 and c.idParent not in
        (select cc.id from category cc where cc.id = c.idParent and cc.isDelete = 1) ORDER BY a.datetime, a.idTOA)
    UNION
    (SELECT aa.* FROM article aa  join category ccc on aa.idCat = ccc.id WHERE aa.idStatus = ${config.statusArticle.released} and aa.isDelete = 0 and ccc.isDelete = 0 and ccc.idParent not in
        (select cccc.id from category cccc where cccc.id = ccc.idParent and cccc.isDelete = 1) and aa.idCat IN (
    SELECT tc.idCat FROM tagcategory tc where tc.idTag = ${idTag})
    ORDER BY aa.datetime, aa.idTOA)
    ORDER BY datetime, idTOA
    LIMIT 5)`),
})
