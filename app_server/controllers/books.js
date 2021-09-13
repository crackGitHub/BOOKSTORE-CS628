const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};

const formatCopies = (copies) => {
  let thisCopies = 0;
  let unit = 'copies';
  thisCopies = copies;
  return thisCopies + unit
};


const showError = (req, res, status) => {
  let title = '';
  let content = '';

  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear, Looks like we can\'t find this page. Sorry';
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title,
    content
  });
};

const renderHomepage = (req, res, responseBody) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('books-list',
    {
      title: 'BOOKSTORE',
      pageHeader: {
        title: 'BOOKSTORE',
        strapLine: 'Find your books'
      },
      books: responseBody,
      message
    }
  );
};

const homelist = (req, res) => {
  const path = '/api/books';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
  };
  request(
    requestOptions,
    (err, {statusCode}, body) => {
      let data = [];
      if (statusCode === 200 && body.length) {
        data = body.map( (item) => {
          item.copies = formatCopies(item.copies);
          return item;
        });
      }
      renderHomepage(req, res, data);
    }
  );
};



const renderDetailPage = (req, res, book) => {
  res.render('book-info',
    {
      title: book.name,
       pageHeader: {
        title: book.name,
      },

      book
    }
  );
};

const getBookInfo = (req, res, callback) => {
  const path = `/api/books/${req.params.bookid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    (err, {statusCode}, body) => {
      const data = body;
      if (statusCode === 200) {

        callback(req, res, data);
      } else {
        showError(req, res, statusCode);
      }
    }
  );
};

const bookInfo = (req, res) => {
  getBookInfo(req, res,
    (req, res, responseData) => renderDetailPage(req, res, responseData)
  );
};

const renderReviewForm = (req, res, {name}) => {
  res.render('book-review-form',
    {
      title: `Review ${name} on BOOKSTORE` ,
      pageHeader: { title: `Review ${name}` },
      error: req.query.err
    }
  );
};

const addReview = (req, res) => {
  getBookInfo(req, res,
    (req, res, responseData) => renderReviewForm(req, res, responseData)
  );
};

const doAddReview = (req, res) => {
  const bookid = req.params.bookid;
  const path = `/api/books/${bookid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect(`/book/${bookid}/review/new?err=val`);
  } else {
    request(
      requestOptions,
      (err, {statusCode}, {name}) => {
        if (statusCode === 201) {
          res.redirect(`/book/${bookid}`);
        } else if (statusCode === 400 && name && name === 'ValidationError') {
          res.redirect(`/book/${bookid}/review/new?err=val`);
        } else {
          showError(req, res, statusCode);
        }
      }
    );
  }
};

module.exports = {
  homelist,
  bookInfo,
  addReview,
  doAddReview
};