const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const router = express.Router();

//GET - http://localhost:8080/getUser
router.get("/getUser", userController.getUser);

//POST - http://localhost:8080/registerUser
router.post(
  "/registerUser",
  [
    body("name")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Name must contain only alphabets"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be min 8 character long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  ],
  userController.postUser
);

//GET - http://localhost:8080/getUserById/id
router.get("/getUserById/:userId", userController.getUserById);

//PUT - http://localhost:8080/editUser/id
router.put("/editUser/:userId", userController.updateUser);

//DELETE - http://localhost:8080/deleteUser/id
router.delete("/deleteUser/:userId", userController.deleteUser);

//POST - http://localhost:8080/login
router.post("/login", userController.postLogin);

//POST - http://localhost:8080/resetPassword
router.post("/resetPassword", userController.resetPasswordlink);

module.exports = router;
