exports.index = function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send('{"applinks":{"apps":[],"details":[{"appID":"2H7JJNVPU3.com.mambo.sura.Ahora","paths":["*"]}]},"webcredentials":{"apps":["2H7JJNVPU3.com.mambo.sura.Ahora"]}}');
};