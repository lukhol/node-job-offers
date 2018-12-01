const express = require('express');
const router = express.Router();
const auth = require('../middlewares/checkAuth');

const JobOffersController = require('../controllers/JobOfferController');

router.get('/search', JobOffersController.search);
router.get('/', JobOffersController.getAll);
router.get('/:id', JobOffersController.getById);
router.post('/', auth, JobOffersController.create);

module.exports = router;