const express = require('express');
const {getDB, startMongoConnection, createObjectId} = require('./db');
const quizModel = require('./quizModel');

const app = express();

const api = express.Router();

api.use(express.json());

api.get('/', (req, res) => {
  let db = getDB();
  db.collection('quizes').find().toArray()
    .then(data => {
      data = data.map(x => {
        return {
          _id: x._id,
          name: x.name,
          numQuestions: x.questions.length
        };
      });
      res.json({data});
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

api.get('/quiz/:id', (req, res) => {
  let quizId = req.params.id;
  Promise.all([
    quizModel.getQuizById(quizId, true),
    quizModel.getQuizTopList(quizId)
  ])
    .then(data => {
      let quiz = data[0];
      quiz.topList = data[1];
      return quiz;
    })
    .then(quiz => {
      res.json(quiz);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

api.post('/quiz/:id/entry', (req, res) => {
  let quizId = req.params.id;
  let answers = req.body.answers;
  if (!answers) {
    return res.status(400).end();
  }

  quizModel.getQuizById(quizId)
    .then(quiz => {
      let correct = 0;
      let correctAnswers = [];
      for (let i = 0; i < quiz.questions.length; i += 1) {
        let question = quiz.questions[i];
        let givenAnswer = answers[i];
        if (question.answers[givenAnswer].correct) {
          correct += 1;
          correctAnswers.push(i);
        } else {
          let correctIndex = question.answers.findIndex(x => x.correct);
          correctAnswers.push(correctIndex);
        }
      }

      let correction = {correct: correct, total: quiz.questions.length};
      return quizModel.createQuizEntry(quizId, correction)
        .then(() => {
          res.json({
            ...correction,
            correctAnswers: correctAnswers,
          });
        });
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

api.post('/quiz', (req, res) => {
  let data = req.body;
  if (!data || !data.name || !data.questions) {
    res.status(400).end();
    return;
  }
  let db = getDB();
  db.collection('quizes').insertOne(data)
    .then(() => {
      res.status(201).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.use('/api', api);

startMongoConnection()
  .then(() => {
    app.listen(8090, function() {
      console.log('Started on 8090');
    });
  });
