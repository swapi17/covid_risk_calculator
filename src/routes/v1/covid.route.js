
const express = require('express');
const auth = require('../../middlewares/auth');
const covidController = require('../../controllers/covid.controller');
const router = express.Router();


router
  .route('/register')
  .post(covidController.registerUser);

router
  .route('/self-assessment')
  .post(covidController.selfAssessment);

router
  .route('/user/covidresult')
  .post(covidController.updateCovidResult);

router
  .route('/zoneinfo')
  .post(covidController.getZoneInfo);

module.exports = router;


