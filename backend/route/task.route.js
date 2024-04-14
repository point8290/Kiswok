const express = require("express");
const controller = require("../controller/task.controller");
const router = express.Router();

router.get("/:id", controller.getTasks);
router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.patch("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
