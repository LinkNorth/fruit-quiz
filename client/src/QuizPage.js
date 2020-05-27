import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

function QuizQuestion({question, questionIndex}) {
  return <div>
    <h4>{question.question}</h4>
    {question.answers.map((answer, index) => {
      return <p key={index}><input name={questionIndex} type='radio' />{answer.answer}</p>;
    })}
  </div>
}

export default function QuizPage({match}) {
  let [quiz, setQuiz] = useState(null);
  useEffect(() => {
    axios.get('/api/quiz/' + match.params.id)
      .then(res => {
        setQuiz(res.data);
      });
  }, []);

  if (quiz === null) return <p>Loading...</p>;
  return <div>
    <h3>{quiz.name}</h3>
    {quiz.questions.map((question, index) => <QuizQuestion key={index} question={question} questionIndex={index} />)}
  </div>
}
