module.exports = function (app, Answer, Question) {
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/api/addAnswer', function (req, res) {
    console.log(req.body);
    Answer.create(req.body, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    })
  });

};
