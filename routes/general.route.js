const express = require(`express`);
const router = express.Router();
const articleModels = require(`../models/article.model`);
const articleModel = require("../models/article.model");
const commentModel = require("../models/comment.model");
const config = require('../config/default.json');
const accountModel = require('../models/account.model')
const tagModel = require('../models/tag.model')
const categoryModel = require('../models/category.model')

//In PDF
// const puppeteer = require(`puppeteer`);
// const fs = require(`fs-extra`);
// const path = require(`path`);
// const hbs = require(`handlebars`)
// const moment = require(`moment`)

router.get(`/`, async (req, res) => {
    //Nếu không đăng nhập thì bt
    //Nếu đăng nhập mà còn hạn premium thì lấy ưu tiên những bài cho premium

    var list_cateParent = await articleModels.cateParent();
    for(var e of list_cateParent)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }

    var list_cateParentAll = await articleModels.cateParentAll();
    for(var e of list_cateParentAll)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }

    if (req.isAuthenticated()) {
      let acc = await accountModel.findByID(req.session.passport.user.id);
      if (acc.expiredPre && acc.expiredPre > Date.now()) {
            var list_newArt = await articleModel.newArticlePre();
            var list_highlightsArt = await articleModels.highlightsArticlePre();
            var list_topViewEachCate = await articleModels.topViewEachCatePre();
            var list_topNewEachCate = await articleModel.topNewEachCatePre();
            var list_topNewEachCate1 = list_topNewEachCate.slice(0, 5);
            var list_topNewEachCate2 = list_topNewEachCate.slice(5, 10);
            res.render(`general/article`, {
                list_newArt,
                list_highlightsArt,
                list_topViewEachCate,
                list_topNewEachCate1,
                list_topNewEachCate2,
                list_cateParent,
                list_cateParentAll,
                empty_tnec1: list_topNewEachCate1.length != 0,
                empty_tnec2: list_topNewEachCate2.length != 0,
                layout: 'mainMenu'
            });
            return
      }
    }

    // var list = await articleModels.all();
    var list_newArt = await articleModels.newArticle();
    var list_highlightsArt = await articleModels.highlightsArticle();
    var list_topViewEachCate = await articleModels.topViewEachCate();
    var list_topNewEachCate = await articleModel.topNewEachCate();
    var list_topNewEachCate1 = list_topNewEachCate.slice(0, 5);
    var list_topNewEachCate2 = list_topNewEachCate.slice(5, 10);
    res.render(`general/article`, {
        list_newArt,
        list_highlightsArt,
        list_topViewEachCate,
        list_topNewEachCate1,
        list_topNewEachCate2,
        list_cateParent,
        list_cateParentAll,
        empty_newArt: list_newArt.length === 0,
        empty_hlArt: list_highlightsArt === 0,
        empty_topVEArt: list_topViewEachCate === 0,
        empty_cateParent: list_cateParent === 0,
        empty_tnec1: list_topNewEachCate1.length != 0,
        empty_tnec2: list_topNewEachCate2.length != 0,
        layout: 'mainMenu'
    });
})

router.post('/search' ,async (req,res)=> {
    const search = req.body.search;
    var list_cateParent = await articleModels.cateParent();
    for(var e of list_cateParent)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }
    var list_cateParentAll = await articleModels.cateParentAll();
    for(var e of list_cateParentAll)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }

    if (req.isAuthenticated()) {
        let acc = await accountModel.findByID(req.session.passport.user.id);
        if (acc.expiredPre && acc.expiredPre > Date.now()) {
            const listSearch = await articleModels.fullTextSearchPre(search);
            res.render(`../views/general/search`, {
                listSearch,
                empty_listSearch : listSearch === 0, 
                list_cateParent,
                list_cateParentAll,
                layout: 'mainMenu'
             });
            return
        }
      }

    const listSearch = await articleModels.fullTextSearch(search);
    res.render(`../views/general/search`, {
       listSearch,
       empty_listSearch : listSearch === 0, 
       list_cateParent,
       list_cateParentAll,
       layout: 'mainMenu'
    });
})

router.get('/search/tag/:idTag' ,async (req,res)=> {
    var list_cateParent = await articleModels.cateParent();
    for(var e of list_cateParent)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }
    var list_cateParentAll = await articleModels.cateParentAll();
    for(var e of list_cateParentAll)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }

    if (req.isAuthenticated()) {
      let acc = await accountModel.findByID(req.session.passport.user.id);
      if (acc.expiredPre && acc.expiredPre > Date.now()) {
        var listArtByIDTag = await articleModel.findByIDTagPre(+req.params.idTag);
        res.render(`general/Search`, {
          listSearch: listArtByIDTag,
          empty_listSearch: listArtByIDTag === 0,
          list_cateParent,
          list_cateParentAll,
          layout: 'mainMenu'
        });
        return;
      }
    }

    var listArtByIDTag = await articleModel.findByIDTag(+req.params.idTag);
    res.render(`general/Search`, {
       listSearch : listArtByIDTag,
       empty_listSearch : listArtByIDTag === 0, 
       list_cateParent,
       list_cateParentAll,
       layout: 'mainMenu'
    });
})

router.get("/ListArt/:IDCat", async (req, res) => {
  //const limit = 2;
  var list_cateParent = await articleModels.cateParent();
  for (var e of list_cateParent) {
    var result = await articleModels.getCatebyIDParent(e.id);
    e.list_cateChild = result;
  }
  var list_cateParentAll = await articleModels.cateParentAll();
  for (var e of list_cateParentAll) {
    var result = await articleModels.getCatebyIDParent(e.id);
    e.list_cateChild = result;
  }

  var page = +req.query.page || 1;
  if (page < 0) page = 1;

  // console.log(page);

  const offset = (page - 1) * config.pagination.limit;

  if (req.isAuthenticated()) {
    let acc = await accountModel.findByID(req.session.passport.user.id);
    if (acc.expiredPre && acc.expiredPre > Date.now()) {

        const flagCBB = await categoryModel.checkIDParent(+req.params.IDCat)
        if (flagCBB)
        {
            var lisArtByIdCat = await articleModels.getListArtByIDCatPreParent(
                +req.params.IDCat,
                config.pagination.limit,
                offset
              );   
        }
        else
        {
            var lisArtByIdCat = await articleModels.getListArtByIDCatPre(
                +req.params.IDCat,
                config.pagination.limit,
                offset
              );   
        }    
    }
    else
    {
        const flagCBB = await categoryModel.checkIDParent(+req.params.IDCat)
        if (flagCBB)
        {
            var lisArtByIdCat = await articleModels.getListArtByIDCatParent(
                +req.params.IDCat,
                config.pagination.limit,
                offset
              );
        }
        else
        {
            var lisArtByIdCat = await articleModels.getListArtByIDCat(
                +req.params.IDCat,
                config.pagination.limit,
                offset
              );
        }   
    }
  }
  else{

    const flagCBB = await categoryModel.checkIDParent(+req.params.IDCat)
    if (flagCBB)
    {
        var lisArtByIdCat = await articleModels.getListArtByIDCatParent(
            +req.params.IDCat,
            config.pagination.limit,
            offset
          );
    }
    else
    {
        var lisArtByIdCat = await articleModels.getListArtByIDCat(
            +req.params.IDCat,
            config.pagination.limit,
            offset
          );
    }
  }


  
  // console.log(req.params.IDCat);
  // console.log(lisArtByIdCat);

  const total = await articleModels.countByCat(+req.params.IDCat);
  var nPages = Math.ceil(total[0].total / 2);

  // console.log(nPages);
  // console.log(total[0]);
  var page_items = [];
  for (let i = 1; i <= nPages; i++) {
    var item = {
      value: i,
      isActive: i === page,
    };
    page_items.push(item);
  }
  res.render(`general/ListArt`, {
    lisArtByIdCat,
    empty_listArtByCat: lisArtByIdCat === 0,
    page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    layout: 'mainMenu',
    list_cateParent,
    list_cateParentAll,
  });
})

router.get('/byID/:ID', async function (req, res) {
    //check bài viết là premium
    //Nếu chưa đăng nhập không cho xem
    //Đăng nhập rồi thì check có premium còn thời hạn không?
    //Nếu còn cho xem
    //Không thì không cho xem
    const listArtbyID = await articleModel.getArtbyID(+req.params.ID)
    const listAnotherArt = await articleModels.getAnotherArt(listArtbyID[0].idCat, +req.params.ID)
    const listCmt = await articleModels.getComtByID(+req.params.ID)
    var list_cateParent = await articleModels.cateParent();
    var tagList = await tagModel.loadByIDArticle(+req.params.ID);
    for(var e of list_cateParent)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }
    var list_cateParentAll = await articleModels.cateParentAll();
    for(var e of list_cateParentAll)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }

    //cập nhật lượt xem
    let condition = {
        id : +req.params.ID
    }
    let entity = {
        view : +listArtbyID[0].view + 1
    }

    await articleModel.update(entity, condition)

    if (listArtbyID[0].idTOA == config.TOA.idPremium)
    {
        if (req.isAuthenticated())
        {
            let acc = await accountModel.findByID(req.session.passport.user.id)
            if (acc.expiredPre && acc.expiredPre > Date.now())
            {
                res.render(`general/detail`, {
                    listArtbyID : listArtbyID[0],
                    listAnotherArt,
                    empty_listArtbyID: listArtbyID === 0,
                    empty_listAnotherArt: listAnotherArt === 0,
                    empty_listCmt: listCmt === 0,
                    listCmt,
                    isView : true,
                    isDownload : true,
                    layout: 'mainMenu',
                    list_cateParent,
                    list_cateParentAll,
                    tagList,
                });
                return
            }
        }
        res.render(`general/detail`, {
            listArtbyID : listArtbyID[0],
            listAnotherArt,
            empty_listArtbyID: listArtbyID === 0,
            empty_listAnotherArt: listAnotherArt === 0,
            empty_listCmt: listCmt === 0,
            listCmt,
            isView : false,
            isDownload : false,
            layout: 'mainMenu',
            list_cateParent,
            list_cateParentAll,
            tagList,
        });
    }
    else
    {
        res.render(`general/detail`, {
            listArtbyID : listArtbyID[0],
            listAnotherArt,
            empty_listArtbyID: listArtbyID === 0,
            empty_listAnotherArt: listAnotherArt === 0,
            empty_listCmt: listCmt === 0,
            listCmt,
            isView : true,
            isDownload : false,
            layout: 'mainMenu',
            list_cateParent,
            list_cateParentAll,
            tagList,
        });
    } 
})

router.post('/byID/:ID', async function (req, res) {

    const entity = {
        idAcc: req.session.passport.user.id,
        idArt: +req.params.ID,
        content: req.body.message,
    }

    var list_cateParent = await articleModels.cateParent();
    for(var e of list_cateParent)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }
    var list_cateParentAll = await articleModels.cateParentAll();
    for(var e of list_cateParentAll)
    {
        var result = await articleModels.getCatebyIDParent(e.id);
        e.list_cateChild = result;
    }


    const rs = await commentModel.add(entity);

   res.redirect(`/byID/${req.params.ID}`)
})

module.exports = router;
