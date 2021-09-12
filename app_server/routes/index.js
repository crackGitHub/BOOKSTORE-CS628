const express = require('express');
const router = express.Router();


const ctrlBooks = require('../controllers/books');
const ctrlOthers = require('../controllers/others');

router.get('/', ctrlBooks.homelist);
router.get('/book/:bookid', ctrlBooks.bookInfo);
router
  .route('/book/:bookid/review/new')
  .get(ctrlBooks.addReview)
  .post(ctrlBooks.doAddReview)
router.get('/about', ctrlOthers.about);

module.exports = router;
