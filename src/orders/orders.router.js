const router = require("express").Router();
const controller = require("./orders.controller")
const invalidMethod = require("../errors/methodNotAllowed")
// TODO: Implement the /orders routes needed to make the tests pass

router.route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(invalidMethod)

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(invalidMethod)

module.exports = router;

