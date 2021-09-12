const express = require('express');
const router = express.Router();
const ctrlBooks = require('../controllers/books');
const ctrlReviews = require('../controllers/reviews');

// books
router
  .route('/books')
  .get(ctrlBooks.booksList)
  .post(ctrlBooks.booksCreate);

router
  .route('/books/:bookid')
  .get(ctrlBooks.booksReadOne)
  .put(ctrlBooks.booksUpdateOne)
  .delete(ctrlBooks.booksDeleteOne);

// reviews
router
  .route('/books/:bookid/reviews')
  .post(ctrlReviews.reviewsCreate);

router
  .route('/books/:bookid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;