const {getDB, startMongoConnection, createObjectId} = require('./db');

module.exports = {
  getQuizById(quizId, removeAnswers=false) {
    const db = getDB();
    return db.collection('quizes').findOne({_id: createObjectId(quizId)})
      .then(data => {
        if (removeAnswers) {
          data.questions = data.questions.map(question => {
            question.answers = question.answers.map(answer => {
              delete answer.correct;
              return answer;
            });
            return question;
          });
        }

        return data;
      });
  },
  createQuizEntry(quizId, correction) {
    const db = getDB();
    return db.collection('quizes_entries').insertOne({quizId: quizId, correction: correction});
  },
  getQuizTopList(quizId) {
    const db = getDB();
    return db.collection('quizes_entries')
      .find({quizId: quizId})
      .sort({'correction.correct': -1})
      .limit(10)
      .toArray();
  }
};
