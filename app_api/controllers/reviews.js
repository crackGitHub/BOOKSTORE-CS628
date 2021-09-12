const mongoose = require('mongoose');
const Book = mongoose.model('Book');

const doSetAverageRating = (book) => {
  if (book.reviews && book.reviews.length > 0) {
    const count = book.reviews.length;
    const total = book.reviews.reduce((acc, {rating}) => {
      return acc + rating;
    }, 0);

    book.rating = parseInt(total / count, 10);
    book.save(err => {
      if (err) {
        console.log(err);
      } else {
        console.log('Average rating updated to ${book.rating}');
      }
    });
  }
};

const updateAverageRating = (bookId) => {
  Book.findById(bookId)
    .select('rating reviews')
    .exec((err, book) => {
      if (!err) {
        doSetAverageRating(book);
      }
    });
};

const doAddReview = (req, res, book) => {
  if (!book) {
    res
      .status(404)
      .json({"message": "book not found"});
  } else {
    const {author, rating, reviewText} = req.body;
    book.reviews.push({
      author,
      rating,
      reviewText
    });
    book.save((err, book) => {
      if (err) {
        res
          .status(400)
          .json(err);
      } else {
        updateAverageRating(book._id);
        const thisReview = book.reviews.slice(-1).pop();
        res
          .status(201)
          .json(thisReview);
      }
    });
  }
};

const reviewsCreate = (req, res) => {
  const bookId = req.params.bookid;
  if (bookId) {
    Book
      .findById(bookId)
      .select('reviews')
      .exec((err, book) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          doAddReview(req, res, book);
        }
      });
  } else {
    res
      .status(404)
      .json({"message": "book not found"});
  }
};

const reviewsReadOne = (req, res) => {
  Book
    .findById(req.params.bookid)
    .select('name reviews')
    .exec((err, book) => {
      if (!book) {
        return res
          .status(404)
          .json({"message": "book not found"});
      } else if (err) {
        return res
          .status(400)
          .json(err);
      }

      if (book.reviews && book.reviews.length > 0) {
        const review = book.reviews.id(req.params.reviewid);

        if (!review) {
          return res
            .status(404)
            .json({"message": "review not found"});
        } else {
          const response = {
            book: {
              name: book.name,
              id: req.params.bookid
            },
            review
          };

          return res
            .status(200)
            .json(response);
        }
      } else {
        return res
          .status(404)
          .json({"message": "No reviews found"});
      }
    });
};

const reviewsUpdateOne = (req, res) => {
  if (!req.params.bookid || !req.params.reviewid) {
    return res
      .status(404)
      .json({
        "message": "Not found, bookid and reviewid are both required"
      });
  }
  Book
    .findById(req.params.bookid)
    .select('reviews')
    .exec((err, book) => {
      if (!book) {
        return res
          .status(404)
          .json({
            "message": "book not found"
          });
      } else if (err) {
        return res
          .status(400)
          .json(err);
      }
      if (book.reviews && book.reviews.length > 0) {
        const thisReview = book.reviews.id(req.params.reviewid);
        if (!thisReview) {
          res
            .status(404)
            .json({
              "message": "Review not found"
            });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          book.save((err, book) => {
            if (err) {
              res
                .status(404)
                .json(err);
            } else {
              updateAverageRating(book._id);
              res
                .status(200)
                .json(thisReview);
            }
          });
        }
      } else {
        res
          .status(404)
          .json({
            "message": "No review to update"
          });
      }
    }
  );
};

const reviewsDeleteOne = (req, res) => {
  const {bookid, reviewid} = req.params;
  if (!bookid || !reviewid) {
    return res
      .status(404)
      .json({'message': 'Not found, bookid and reviewid are both required'});
  }

  Book
    .findById(bookid)
    .select('reviews')
    .exec((err, book) => {
      if (!book) {
        return res
          .status(404)
          .json({'message': 'book not found'});
      } else if (err) {
        return res
          .status(400)
          .json(err);
      }

      if (book.reviews && book.reviews.length > 0) {
        if (!book.reviews.id(reviewid)) {
          return res
            .status(404)
            .json({'message': 'Review not found'});
        } else {
          book.reviews.id(reviewid).remove();
          book.save(err => {
            if (err) {
              return res
                .status(404)
                .json(err);
            } else {
              updateAverageRating(book._id);
              res
                .status(200)
                .json({'message': 'Delete Successful'});
            }
          });
        }
      } else {
        res
          .status(404)
          .json({'message': 'No Review to delete'});
      }
    });
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};