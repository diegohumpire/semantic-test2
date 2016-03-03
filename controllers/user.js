exports.index = function(req, res, next) {
    res.render('user', { title: 'Users' });
};