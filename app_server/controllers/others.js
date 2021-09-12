
const about = (req, res) => {
    res.render('generic-text', {
        title: 'About',
        content: 'BookStore is a online store for selling all kinds of books.'
    });
};

//expose the index function as a method
module.exports = {
    about
};