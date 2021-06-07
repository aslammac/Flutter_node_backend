const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();

//controllers
const auth = require("../controllers/auth_controller");
//models
const User = require("../models/user_model");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter your email")
      //   .custom((value) => {
      //     return User.findUserByEmail(value).then((user) => {
      //       if (user) {
      //         return Promise.reject("E-mail already in use");
      //       }
      //     });
      //   })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }),
    body("name").trim().not().isEmpty(),
  ],
  //   check("email").custom((value) => {
  //     return User.findByEmail(value).then((user) => {
  //       if (user) {
  //         return Promise.reject("E-mail already in use");
  //       }
  //     });
  //   }),
  auth.signup
);

router.post("/login", auth.login);

router.get("/token", auth.getToken);

module.exports = router;
