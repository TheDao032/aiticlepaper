const express = require(`express`);
const router = express.Router();
const articleModel = require(`../models/article.model`);
const catModel = require(`../models/category.model`);
const tagCategoryModel = require(`../models/tagCategory.model`);
const articleTagModel = require(`../models/articleTag.model`);
const tagModel = require(`../models/tag.model`)
const moment = require(`moment`);
const config = require("../config/default.json");

router.get(`/draft`, async (req, res) => {
    var article_draft = await articleModel. allDetailByIDAccIDStatus(req.session.passport.user.id, config.statusArticle.isPending);

    article_draft.map(x=> {
       const offical_time = moment(x.datetime.toLocaleDateString(), `MM/DD/YYYY`).format(`DD-MM-YYYY`);
       x.post_time = offical_time
    })

    res.render(`editor/list_draft`, {
        article_draft,
        empty: article_draft.length == 0,
        layout : 'main'
    });
})

router.get(`/draft/read`, async (req, res) => {
    var listCat = await catModel.getAllCat();

    const id = +req.query.id || -1;

    const rows = await articleModel.single(id)
    const tagList = await tagModel.loadByIDArticle(id)


    if (rows.length === 0){
        return res.send(`Invalid Parameter`);
    }

    var  article = rows[0];

    listCat.map(x => {
        if (x.id == article.idCat)
        {
            x.flag = true
            article.nameCat = x.name
        }
        else
          x.flag = false
      })

    const offical_time = moment(article.datetime.toLocaleDateString(), `MM/DD/YYYY`).format(`DD-MM-YYYY`);
    article.post_time = offical_time

    res.render(`editor/read`, {
        article,
        listCat,
        tagList,
        layout : 'main'
    });
})

router.post(`/draft/read/approve/:id`, async (req, res) => {
    var idArt = +req.params.id
    var condition = {
      id: idArt
    }

    var entity_article = {
        idCat: req.body.category_select,
        idStatus: config.statusArticle.isWaitingRelease,
        releaseTime: moment(req.body.releaseTime, 'DD/MM/YYYY HH:MM').format('YYYY-MM-DD HH:MM:SS')
      };

    //update article
    await articleModel.updateByID(entity_article, condition)


    // update nhãn
    var listTag = req.body.tag;
    listTag.shift();
    //update tag
      //Delete tag old not in list old tag
        //Get list old tag by idArticle
      //Add new tag in list new tag
    var listOldTag = await tagModel.loadByIDArticle(idArt)
    listOldTag.map(async x => {if (!listTag.includes(x.name)) {
      let conditionX = {
        id: x.idAT
      }
     await articleTagModel.deleteByID(conditionX)
    }})

    for (tag of listTag) {
      var tagObj = await tagModel.findByName(tag);
      if (!tagObj) {
        var result = await tagModel.addWithName(tag);
        tagObj = await tagModel.findByName(tag);
      }

      var articleTagObj = await articleTagModel.findByIDArtTag(idArt, tagObj.id)
      if (!articleTagObj)
        await articleTagModel.addWithIDArtTag(idArt, tagObj.id);

      var tagCatObj = await tagCategoryModel.findByIDCatTag(
        entity_article.idCat,
        tagObj.id
      );
      if (!tagCatObj) {
        await tagCategoryModel.addWithIDCatTag(entity_article.idCat, tagObj.id);
      }
    }
    res.redirect('/editor/draft')
})

router.post(`/draft/read/reject/:id`, async (req, res) => {
    var idArt = +req.params.id
    var condition = {
      id: idArt
    }

    var entity_article = {
        reason: req.body.reason,
        idStatus: config.statusArticle.rejected
      };

    //update article
    await articleModel.updateByID(entity_article, condition)

    res.redirect('/editor/draft')
})

module.exports = router;
