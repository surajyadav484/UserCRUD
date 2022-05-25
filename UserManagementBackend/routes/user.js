const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

//GET - http://localhost:8080/getUser
router.get("/getUser", userController.getUser);

//POST - http://localhost:8080/registerUser
router.post("/registerUser", userController.postUser);

//GET - http://localhost:8080/getUserById/id
router.get("/getUserById/:userId", userController.getUserById);

//PUT - http://localhost:8080/editUser/id
router.put("/editUser/:userId", userController.updateUser);

//DELETE - http://localhost:8080/deleteUser/id
router.delete("/deleteUser/:userId", userController.deleteUser);

module.exports = router;
