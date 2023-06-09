const express = require('express');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

const router = express.Router();

router.route('/register').post(validate(authValidation.register), authController.register);

module.exports = router;
