const router = require("express").Router();
const controller = require("./dishes.controller")
const invalidMethod = require("../errors/methodNotAllowed")

router.route("/:dishId")
    .get(controller.read)
    .post(controller.create)
    .put(controller.update)
    .all(invalidMethod)

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .put(controller.update)
    .all(invalidMethod)
// TODO: Implement the /dishes routes needed to make the tests pass

module.exports = router;
