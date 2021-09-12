const mongoose = require('mongoose');
const Book = mongoose.model('Book');

const booksList = async (req, res) => {
  

  try {
    
    const books = results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        copies: result.copies,
        rating: result.rating,
      }
    });
    res
      .status(200)
      .json(books);
  } catch (err) {
    res
      .status(404)
      .json(err);
  }
};

const booksCreate = (req, res) => {
  Book.create({
    name: req.body.name,
    copies: req.body.copies,

  },
  (err, book) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(book);
    }
  });
};

const booksReadOne = (req, res) => {
    Book
      .findById(req.params.bookid)
      .exec((err, book) => {
        if (!book) {
          return res
            .status(404)
            .json({"message": "book not found"});
        } else if (err) {
          return res
            .status(404)
            .json(err);
        } else {
          return res
            .status(200)
            .json(book);
        }
      });
};

const booksUpdateOne = (req, res) => {
  if (!req.params.bookid) {
    return res
      .status(404)
      .json({
        "message": "Not found, bookid is required"
      });
  }
  Book
    .findById(req.params.bookid)
    .select('-reviews -rating')
    .exec((err, book) => {
      if (!book) {
        return res
          .status(404)
          .json({
            "message": "bookid not found"
          });
      } else if (err) {
        return res
          .status(400)
          .json(err);
      }
      book.name = req.body.name;
      book.copies = req.body.copies;

      book.save((err, Book) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(Book);
        }
      });
    }
  );
};

const booksDeleteOne = (req, res) => {
  const {bookid} = req.params;
  if (bookid) {
    Book
      .findByIdAndRemove(bookid)
      .exec((err, book) => {
          if (err) {
            return res
              .status(404)
              .json(err);
          }
          res
            .status(204)
            .json(null);
        }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "No book"
      });
  }
};

module.exports = {
  booksList,
  booksCreate,
  booksReadOne,
  booksUpdateOne,
  booksDeleteOne
};