const express = require(`express`);
const router = express.Router();
const articleModel = require(`../models/article.model`);
const catModel = require(`../models/category.model`);
const categoryModel = require('../models/category.model')
const categoryManageModel = require('../models/categoryManage.model')
const tagCategoryModel = require(`../models/tagCategory.model`);
const articleTagModel = require(`../models/articleTag.model`);
const tagModel = require(`../models/tag.model`)
const config = require("../config/default.json");
const userModel = require("../models/user.model")
const roleModel = require("../models/role.model")
const passport = require('../middlewares/auth.mdw')
const bcrypt = require('bcryptjs');
const informationUserModel = require('../models/informationUser.model')
const accountModel = require('../models/account.model')
const moment = require('moment')
const helper = require('../models/helper.model');
const restrict = require('../middlewares/roleGeneral.mdw')
const typeModel = require(`../models/type_article.model`);
const multer = require("multer");


router.get(`/articles`, async (req, res) => {
    var article_draft = await articleModel.allDetails();

    article_draft.map(x=> {
       const offical_time = moment(
         x.datetime.toLocaleDateString(),
         `MM/DD/YYYY`
       ).format(`DD-MM-YYYY`);
       x.post_time = offical_time;
    })

    res.render(`admin/article/articles`, {
        article_draft,
        empty: article_draft.length == 0
    });
})

router.get(`/post_article`, async (req, res)=>{
  const listCat = await categoryModel.get_parent_cat();
  const listType_article = await typeModel.all();

  res.render(`admin/article/post_article`, {
    category: listCat,
    type: listType_article,
  });
})

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/images/articleAvatar-img");
  },
});

const storage1 = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./public/images/writer-img");
  },
});

router.post("/uploadImage", async (req, res) => {
  const upload1 = multer({ storage: storage1 });
  upload1.single("file")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(11);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(22);
    }
    res.json({
      location: `/public/images/writer-img/${req.file.originalname}`,
    });
  });
});

router.post(`/post_article`, async (req, res) => {
  // const ts = Date.now()
  // const date_ob = new Date(ts);
  // const date = date_ob.getDate();
  // const month = date_ob.getMonth() + 1;
  // const year = date_ob.getFullYear();
  //const fullDate = year + `-` + month + `-` + date;
  //=======================================================
  const upload = multer({ storage: storage });
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("11==");
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("22==");
    }

    var listTag = req.body.tag;
    listTag.shift();

    var content = req.body.Content;
    content = content.replace('src="..', 'src="');

    const entity_article = {
      title: req.body.title,
      image: `/public/images/articleAvatar-img/${req.file.originalname}`,
      idTOA: req.body.TOA_select,
      synopsis: req.body.summary,
      content,
      idCat: req.body.category_select,
      idACc: req.session.passport.user.id,
    };

    var resultArticle = await articleModel.add(entity_article);

    for (tag of listTag) {
      var tagObj = await tagModel.findByName(tag);
      if (!tagObj) {
        var result = await tagModel.addWithName(tag);
        tagObj = await tagModel.findByName(tag);
      }

      await articleTagModel.addWithIDArtTag(resultArticle.insertId, tagObj.id);

      var tagCatObj = await tagCategoryModel.findByIDCatTag(
        entity_article.idCat,
        tagObj.id
      );
      if (!tagCatObj) {
        await tagCategoryModel.addWithIDCatTag(entity_article.idCat, tagObj.id);
      }
    }

    res.redirect('/admin/post_article')

    // const listCat = await categoryModel.get_parent_cat();
    // const listType_article = await typeModel.all();

    // res.render(`writers/post_article`, {
    //   category: listCat,
    //   type: listType_article,
    //   layout : 'main'
    // });
  });

  //========================================================

  // //Kiểm tra tag có trong db chưa => nếu có lấy id tag
  // //                              => nếu chưa lưu xuống db => lấy id vừa lưu
  // //tag category => kiểm tra tag này có trong category này chưa => nếu chưa thì thêm vào
  // //Lưu article xuống

  // article, tag, tagArticle, tagCategory
});

router.get("/editPostArticle/:id", async (req, res) => {
  var idArt = +req.params.id;
  var art = await articleModel.findByID(idArt);
  var listCat = await categoryModel.get_parent_cat();
  var listType_article = await typeModel.all();
  var tagList = await tagModel.loadByIDArticle(idArt);

  listCat.map((x) => {
    if (x.id == art.idCat) x.flag = true;
    else x.flag = false;
  });

  listType_article.map((x) => {
    if (x.id == art.idTOA) x.flag = true;
    else x.flag = false;
  });

  res.render(`admin/article/editPostArticle`, {
    category: listCat,
    type: listType_article,
    article: art,
    tagList,
    layout : 'main'
  });
});

router.post("/editPostArticle/:id", async (req, res) => {
  const upload = multer({ storage: storage });
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("11==editPostArticle=Post=");
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("22==editPostArticle=Post=");
    }

    var idArt = +req.params.id;
    var condition = {
      id: idArt,
    };

    var content = req.body.Content;
    content = content.replace('src="../..', 'src="');

    var entity_article = {
      title: req.body.title,
      idTOA: req.body.TOA_select,
      synopsis: req.body.summary,
      content,
      idCat: req.body.category_select,
      idStatus: config.statusArticle.isPending,
    };

    if (req.file) {
      entity_article.image = `/public/images/articleAvatar-img/${req.file.originalname}`;
    }

    console.log(entity_article)
    console.log(condition)

    //update article
    // await articleModel.updateByID(entity_article,condition);
    await articleModel.update(entity_article, condition)
    console.log(entity_article)
    console.log(condition)

    var listTag = req.body.tag;
    listTag.shift();
    //update tag
    //Delete tag old not in list old tag
    //Get list old tag by idArticle
    //Add new tag in list new tag

    var listOldTag = await tagModel.loadByIDArticle(idArt);
    if (listOldTag) {
      listOldTag.map(async (x) => {
        if (!listTag.includes(x.name)) {
          let conditionX = {
            id: x.idAT,
          };
          await articleTagModel.deleteByID(conditionX);
        }
      });
    }

    if (listTag) {
      for (tag of listTag) {
        var tagObj = await tagModel.findByName(tag);
        if (!tagObj) {
          var result = await tagModel.addWithName(tag);
          tagObj = await tagModel.findByName(tag);
        }

        var articleTagObj = await articleTagModel.findByIDArtTag(
          idArt,
          tagObj.id
        );
        if (!articleTagObj)
          await articleTagModel.addWithIDArtTag(idArt, tagObj.id);

        var tagCatObj = await tagCategoryModel.findByIDCatTag(
          entity_article.idCat,
          tagObj.id
        );
        if (!tagCatObj) {
          await tagCategoryModel.addWithIDCatTag(
            entity_article.idCat,
            tagObj.id
          );
        }
      }
    }

    res.redirect(`/admin/editPostArticle/${idArt}`);
  });
});

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
  res.redirect('/admin/articles')
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

  res.redirect('/admin/articles')
})


router.get(`/articles/read`, async (req, res) => {
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

    if (
      article.idStatus == config.statusArticle.isPending ||
      article.idStatus == config.statusArticle.rejected
    )
      article.popUpFlag = true;
    else article.popUpFlag = false;

  const offical_time = moment(article.datetime.toLocaleDateString(), `MM/DD/YYYY`).format(`DD-MM-YYYY`);
  article.post_time = offical_time

  res.render(`admin/article/read`, {
      article,
      listCat,
      tagList,
  });
})

router.get(`/articles/read/delete/:id`, async (req, res) => {
  var idArt = +req.params.id
  //delete tagArticle
  // var listArticleTag = await articleTagModel.findByIDArt(idArt)
  // if (listArticleTag)
  // {
  //   for (var at of listArticleTag)
  //   {
  //     var condition = {
  //       id : at.id
  //     }
  //     await articleTagModel.deleteByID(condition)
  //   }
  // }
  //delete article
  // var condition = {
  //   id : idArt
  // }
  await articleModel.deleteByID(idArt)

  res.redirect('/admin/articles')
})

///User

router.get('/users', async function(req, res) {
  const list = await userModel.allExceptAdmin(config.role.idAdmin);
  list.map(x => {
    if (x.idRole == config.role.idSubscriber)
    {
      x.flagSub = true
      x.flagEditor = false

      x.isExpired = false;
      x.isNew = true;
      if (x.expiredPre) {
        x.isNew = false;
        x.isExpired = x.expiredPre <= Date.now();
        // console.log(x.expiredPre)
      }
      x.expiredPre = moment(x.expiredPre, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY hh:mm:ss");
    }
    else if (x.idRole == config.role.idEditor)
    {
      x.flagSub = false
      x.flagEditor = true
    }
    else
    {
      x.flagSub = false
      x.flagEditor = false
    }
  })
  res.render('admin/user/list', {
      users: list,
      empty: list.length === 0,
      // layout: false
  });
})

router.get('/users/add', async function(req, res) {
  const roles = await roleModel.allExceptIDRole(config.role.idGuest)
  roles.map(x => {
    if (x.id == config.role.idGuest)
      x.flag = true
    else
      x.flag = false
  })
  res.render('admin/user/add', {layout: 'notTemplate', roles});
})

router.post("/users/add", async function (req, res) {
  try {
    const acc = {
      username: req.body.username,
      password: bcrypt.hashSync(
        req.body.password,
        config.authentication.saltRounds
      ),
      idRole: +req.body.role,
    };
    await accountModel.addAcc(acc);
    const user = await accountModel.findByUsername(acc.username);
    const info = {
      fullName: req.body.fullname,
      DOB: moment(req.body.DOB, "DD/MM/YYYY").format("YYYY-MM-DD"),
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      idAcc: user.id,
    };
    informationUserModel.add(info);
    let roles = await roleModel.allExceptIDRole(config.role.idGuest);
    roles.map((x) => {
      if (x.id == config.role.idGuest) x.flag = true;
      else x.flag = false;
    });
    res.render("admin/user/add", {
      layout: 'notTemplate',
      roles,
      message: "Thêm thành công",
    });
  } catch (err) {
    let roles = await roleModel.allExceptIDRole(config.role.idGuest);
    roles.map((x) => {
      if (x.id == config.role.idGuest) x.flag = true;
      else x.flag = false;
    });
    //Màn hình thông báo lỗi
    res.render("admin/user/add", {
      layout: 'notTemplate',
      message: "Lỗi hệ thống hãy thử lại",
      roles,
    });
  }
});

router.get('/users/edit/:username/:idRole/:idAcc', async function(req, res) {
  var info = await informationUserModel.findByUsername(req.params.username)
  const roles = await roleModel.allExceptIDRole(config.role.idGuest)
  roles.map(x => {
    if (x.id == req.params.idRole)
      x.flag = true
    else
      x.flag = false

    if (x.idFacebook || x.idGoogle)
      x.isAllowChangePassword = false
    else 
      x.isAllowChangePassword = true
  })

  var isEditor = info.idRole === config.role.idEditor
  var isSubscriber = info.idRole === config.role.idSubscriber
  var isExpired = false;
  var isNew = true;

  if (info.expiredPre.getYear() > 70) {
    isNew = false;
    isExpired = info.expiredPre <= Date.now();
  }
  info.expiredPre = moment(info.expiredPre, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY hh:mm:ss");
  res.render('admin/user/edit', {layout: 'notTemplate',
    info,
    isWriter : req.params.idRole == config.role.idWriter,
    roles,
    isExpired,
    isNew,
    isSubscriber,
    isEditor})
})

router.post('/users/edit/:username/:idRole/:idAcc', async function(req, res) {
  const entity = {
    fullName : req.body.fullName,
    pseudonym : req.body.pseudonym,
    email : req.body.email,
    DOB : moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    gender : req.body.gender,
    phone : req.body.phone
  }

  const condition = {
    idAcc : +req.params.idAcc
  }

  await informationUserModel.update(entity, condition)

  entityAcc = {
    idRole : +req.body.role
  }

  const conditionAcc = {
    id : +req.params.idAcc
  }

  await accountModel.update(entityAcc, conditionAcc)

  res.redirect(`/admin/users/edit/${req.params.username}/${req.body.role}/${req.params.idAcc}`)

  // var info = await informationUserModel.findByUsername(req.params.username)
  // const roles = await roleModel.allExceptIDRole(config.role.idGuest)
  // roles.map(x => {
  //   if (x.id == req.params.idRole)
  //     x.flag = true
  //   else
  //     x.flag = false
  // })

  // var isEditor = info.idRole === config.role.idEditor
  // var isSubscriber = info.idRole === config.role.idSubscriber
  // var isExpired = false;
  // var isNew = true;
  // if (info.expiredPre) {
  //   isNew = false;
  //   isExpired = info.expiredPre <= Date.now();
  // }
  // info.expiredPre = moment(info.expiredPre, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY hh:mm:ss");
  // res.render('admin/user/edit', {layout: 'notTemplate',
  //   info,
  //   isWriter : req.params.idRole == config.role.idWriter,
  //   roles,
  //   isExpired,
  //   isNew,
  //   isSubscriber,
  //   isEditor})
})

router.get('/users/delete/:idAcc',async function(req, res) {
  await userModel.delete(+req.params.idAcc)
  res.redirect('/admin/users');
})

// router.post('/users/del', async function(req, res) {
//   await userModel.del(req.body.CatID);
//   res.redirect('/admin/users');
// })

router.post('/users/update', async function(req, res) {
  await userModel.patch(req.body);
  res.redirect('/admin/users');
})

router.post('/users/assign', async function(req, res) {
  let acc = await accountModel.findByUsername(req.body.username)
    var minutes = 60*24*7
    var a = new Date();
    a.setTime(a.getTime() + minutes*60*1000)
    let entity = {
        //expiredPre : d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        expiredPre : a
    }
    let condition = {
        id : acc.id
    }
    // console.log(entity)
    await accountModel.update(entity, condition)
    res.redirect('/admin/users')
})

router.post('/users/extend', async function(req, res) {
  let acc = await accountModel.findByUsername(req.body.username)
    var minutes = 60*24*7
    var a = new Date();
    a.setTime(a.getTime() + minutes*60*1000)
    let entity = {
        //expiredPre : d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        expiredPre : a
    }
    let condition = {
        id : acc.id
    }
    // console.log(entity)
    await accountModel.update(entity, condition)
    res.redirect('/admin/users')
})

router.get('/editEditor/:id', async function(req, res) {

    const id = +req.params.id || -1;
    const rows = await userModel.single(id);
    if (rows.length === 0)
        return res.send('Invalid parameter.');

    const category = await categoryModel.get_parent_cat();
    const categoryManage = await categoryManageModel.catManage(id)
    category.map(async x => {
      var result = await categoryManage.find(a => a.idCat == x.id);
      if (result) x.flag = true;
      else x.flag = false;
    });

    const user = rows[0];
    res.render('admin/user/editEditor', { user, category });

})

router.post('/editEditor', async function(req, res) {
  //Xóa hết
  await categoryManageModel.del(req.body.id)
  //Thêm lại nếu commbobox có
  if (req.body.checkbox)
  {
    req.body.checkbox.forEach(async e => {
      let entity = {
        idAcc : +req.body.id,
        idCat : +e
      }
      await categoryManageModel.add(entity)
    });
  }

  const id = +req.body.id || -1;
    const rows = await userModel.single(id);
    if (rows.length === 0)
        return res.send('Invalid parameter.');

    const category = await categoryModel.get_parent_cat();
    const categoryManage = await categoryManageModel.catManage(id)

    category.map(async x => {
      var result = await categoryManage.find(a => a.idCat == x.id);
      if (result) x.flag = true;
      else x.flag = false;
    });

    const user = rows[0];
    res.render('admin/user/editEditor', { user, category, layout : 'main' });
})


//tags

router.get('/tags', async function(req, res) {
  const list = await tagModel.all();
  res.render('admin/tag/list', {
      tags: list,
      empty: list.length === 0,
      layout : 'main' 
  });
})

router.get('/tags/add', function(req, res) {
  res.render('admin/tag/add', {layout : 'main' });
})

router.post('/tags/add', async function(req, res) {
  await tagModel.add(req.body);
  res.render('admin/tag/add',  {layout : 'main' });
})

router.get('/tags/edit/:id', async function(req, res) {
  const id = +req.params.id || -1;
  const rows = await tagModel.single(id);
  if (rows.length === 0)
      return res.send('Invalid parameter.');

  const tag = rows[0];
  res.render('admin/tag/edit', { tag, layout : 'main' });
})

router.get('/tags/del/:id', async function(req, res) {
  condition = {
    idTag : +req.params.id
  }
  await articleTagModel.deleteByID(condition)
  await tagModel.del(+req.params.id);
  res.redirect('/admin/tags');
})

router.post('/tags/update', async function(req, res) {
  await tagModel.patch(req.body);
  res.redirect('/admin/tags');
})

router.get('/tags/existNameTag', async function(req, res) {
  var result = await tagModel.isExists(req.query.tagName)
  res.json(!result)
})

router.get('/tags/existTag', async function(req, res) {
  var result = await tagModel.existTag(+req.query.tagID, req.query.tagName)
  res.json(result)
})

//categories

router.get('/categories', async function(req, res) {
  const list = await categoryModel.all();
  res.render('admin/category/list', {
      categories: list,
      empty: list.length === 0,
      layout : 'main'
  });
})

router.get('/categories/add', async function(req, res) {
  const categories = await categoryModel.root();
  const idnew = await categoryModel.test();
  res.render('admin/category/add', {
      categories,
      idnew,
      layout : 'main'
  });
})

router.post('/categories/add', async function(req, res) {

  var idParent = req.body.idParent;

  //check catName mà đã tồn tại
  //thì bật về 0
  var result = await categoryModel.existNameCategoryInAll(req.body.CatName)
  if (result)
  {
    const entity_cat = {
      isDelete: 0,
      id : result.id
    }
    await categoryModel.patch(entity_cat)
  }
  else
  {
    if (idParent)
    {
      const entity_cat = {
        name: req.body.CatName,
        idParent
      }
      var result = await categoryModel.add(entity_cat);
    }
    else
    {
      const entity_cat = {
        name: req.body.CatName,
      }
      var result = await categoryModel.add(entity_cat);

      const entity = {
        idParent: result.insertId,
        id : result.insertId
      }
      await categoryModel.patch(entity)
    }
  }

  res.redirect('/admin/categories/add')

  // const categories = await categoryModel.root();
  // const idnew = await categoryModel.test();
  // res.render('admin/category/add', {
  //     categories,
  //     idnew,
  //     layout : 'main'
  // });
})

router.get('/categories/edit/:id', async function(req, res) {
  const id = +req.params.id;
  const rows = await categoryModel.single(id);
  if (rows.length === 0)
      return res.send('Invalid parameter.');
  const category = rows[0];



  const categoriesRoot = await categoryModel.root();

  const flagCBB = await categoryModel.checkIDParent(id)
  categoriesRoot.map(x => {
      if (x.id == category.idParent) {
          x.flag = true
      } else
          x.flag = false
  })
  res.render('admin/category/edit',
      { category,
        categoriesRoot,
        flagCBB,
        layouts: 'main'
      });
})

router.get('/categories/delete/:idAcc', async function(req, res) {
  await categoryModel.delete(req.params.idAcc)
  res.redirect('/admin/categories');
})

router.post('/categories/update', async function(req, res) {
  const entity_cat = {
      id: req.body.id,
      name: req.body.CatName,
      idParent: req.body.idParent
  }
  await categoryModel.patch(entity_cat);
  res.redirect('/admin/categories');
})

router.get('/categories/existCategory', async function(req, res) {
  var catID = +req.query.catID
  var catName = req.query.catName
  var result = await categoryModel.existCategory(catID, catName)
  res.json(result)
})

router.get('/categories/existNameCategory', async function(req, res) {
  var catName = req.query.catName
  var result = await categoryModel.existNameCategory(catName)
  res.json(result)
})

module.exports = router;
