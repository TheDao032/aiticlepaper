const express = require(`express`);
const router = express.Router();
const categoryModel = require(`../models/category.model`);
const articleModel = require(`../models/article.model`);
const tagModel = require(`../models/tag.model`);
const statusModel = require(`../models/status.model`);
const typeModel = require(`../models/type_article.model`);
const tagCategoryModel = require(`../models/tagCategory.model`);
const articleTagModel = require(`../models/articleTag.model`);
const config = require("../config/default.json");
const multer = require("multer");

router.get(`/post_article`, async (req, res) => {
  const listCat = await categoryModel.get_parent_cat();
  const listType_article = await typeModel.all();

  res.render(`writers/post_article`, {
    category: listCat,
    type: listType_article,
    layout : 'main'
  });
});

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

    const listCat = await categoryModel.get_parent_cat();
    const listType_article = await typeModel.all();

    res.render(`writers/post_article`, {
      category: listCat,
      type: listType_article,
      layout : 'main'
    });
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
  var art = await articleModel.findByIDArtIDAcc(idArt, +req.session.passport.user.id);
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

  res.render(`writers/editPostArticle`, {
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

    res.redirect("/writer/list_article");
  });
});

router.get(`/list_article`, async (req, res) => {
  var article_list = await articleModel.allDetailsByIDAcc(
    req.session.passport.user.id
  );

  var status = await statusModel.all();

  article_list.map((x) => {
    if (
      x.idStatus === config.statusArticle.isPending ||
      x.idStatus === config.statusArticle.rejected
    )
      x.editFlag = true;
    else x.editFlag = false;

    if (x.idStatus == config.statusArticle.rejected)
      x.rejectedFlag = true
    else
      x.rejectedFlag = false
  });

  // article_list.forEach(e => {
  //     if (x.idStatus == 13 || x.idStatus == 15)
  //         x.editFlag = true;
  //     else
  //         x.editFlag = false;
  // })

  res.render(`writers/list_article`, {
    article_list,
    empty: article_list.length == 0,
    layout : 'main',
    status
  });
});

router.get(`/list_article/:idStatus`, async (req, res) => {
  var article_list = await articleModel.allDetailByIDAccIDStatusWriter(
    req.session.passport.user.id, req.params.idStatus
  );

  var status = await statusModel.all();

  status.map((y) => {
    if (y.id == req.params.idStatus)
      y.flag = true
    else
      y.flag = false
  })

  article_list.map((x) => {
    if (
      x.idStatus === config.statusArticle.isPending ||
      x.idStatus === config.statusArticle.rejected
    )
      x.editFlag = true;
    else x.editFlag = false;

    if (x.idStatus == config.statusArticle.rejected)
      x.rejectedFlag = true
    else
      x.rejectedFlag = false
  });

  // article_list.forEach(e => {
  //     if (x.idStatus == 13 || x.idStatus == 15)
  //         x.editFlag = true;
  //     else
  //         x.editFlag = false;
  // })

  res.render(`writers/list_article`, {
    article_list,
    empty: article_list.length == 0,
    layout : 'main',
    status
  });
});

router.get(`/list_article/read`, async (req, res) => {
  const article_list = await articleModel.allDetails();
  const id = +req.query.id || -1;

  res.render(`writers/list_article`, {
    article_list,
    empty: article_list.length == 0,
    layout : 'main'
  });
});

router.get(`/contentStatus/:status`, async (req, res) => {
  if (req.params.status == 0)
  {
    var data = await articleModel.allDetailsByIDAcc(
      req.session.passport.user.id
    );
  }
  else
  {
    var data = await articleModel.allDetailByIDAccIDStatus(
      +req.session.passport.user.id,
      +req.params.status
    );
  }
  console.log(data);
  res.json(data);
  
});

module.exports = router;
