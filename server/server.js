const express = require('express');
const {getDB, startMongoConnection, createObjectId} = require('./db');

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
  let db = getDB();
  db.collection('quizes').findOne({_id: createObjectId(quizId)})
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

api.post('/quiz', (req, res) => {
  let data = req.body;
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
