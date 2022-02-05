const express = require("express");
const bcrypt = require("bcrypt");
const User =require("../models/user");

const jwt = require("jsonwebtoken");

const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png' :'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}


const storage = multer.diskStorage( {
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;

    }
    cb(error, "backend/images");
  },
  filename: (req,file,cb) => {
    const name= file.originalname.toLowerCase().split('').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


router.post("/signup",multer({storage: storage}).single("image"),(req,res,next) => {
  const url = req.protocol + "://" +req.get("host");
  console.log(req.body);

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User( {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email,
      password: hash,
      city: req.body.city,
      date_of_birth: req.body.date_of_birth,
      contact_phone: req.body.contact_phone,
      imagePath: url + "/images/" + req.file.filename
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message:"user created!",
          result:result
        })
      })
      .catch(err => {
        res.status(500).json({
          error:err
        })
      })
  })


});
router.post("/login", (req,res,next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email})
  .then(user => {
    console.log(user);
    if(!user) {
      return res.status(401).json( {
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {

    if(!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'secret_this_should_be_longer', {expiresIn: "1h" });
    console.log(token);
    console.log(fetchedUser.favoriteArray);
    res.status(200).json( {
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      useremail:fetchedUser.email,
      favoritePosts:fetchedUser.favoriteArray
    })
  })
  .catch(err => {
    console.log(err);
    return res.status(401).json( {
      message: "Auth failed"
    })
  })
})

router.put("/favorite/:id",(req,res,next) => {

  const postId = +req.query.postId;
  //console.log(req.params.id);
  console.log(req.query);
  console.log(req.query.postId);
  User.updateOne({_id: req.params.id},{ $push: { favoriteArray: req.query.postId.toString()}}).then(result => {
    if(result.nModified >0) {
      res.status(200).json( {
        message:"Sve oke!"
      })
    }
    else {
      res.status(401).json({message: "Not authorized!"});
      console.log("fail");
    }
  })
})


router.get('',(req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if(pageSize && currentPage) {
    userQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
  }
  userQuery.find()
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
  }).then( count => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      users: fetchedUsers,
      maxUsers: count
  });
  });
});

module.exports = router;
