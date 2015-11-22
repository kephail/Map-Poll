module.exports = function (app, Answer, Question) {
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/:id', function (req, res) {
    Question.find({_id: req.params.id}, function (err, question) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      else {
        console.log(question);
        res.render('index', question);
      }
    });
  });

  app.post('/api/addAnswer', function (req, res) {
    Answer.create(req.body, function (err, answer) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      else {
        res.send(answer);
      }
    });
  });

  app.get('/api/getAnswers', function (req, res) {
    Answer.find({questionId: req.body.questionId}, function (err, answers) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      else {
        res.send(answers);
      }
    });
  });

  app.get('/api/getQuestions', function (req, res) {
    Question.find(function (err, questions) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      else {
        res.send(questions);
      }
    });
  });

  app.get('/api/getQuestion/:id', function (req, res) {
    Question.find({_id: req.params.id}, function (err, question) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      else {
        res.send(question);
      }
    });
  });

};
