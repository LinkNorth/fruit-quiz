import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';

function QuizQuestion({question, questionIndex, onAnswerChange, chosenAnswer, correctAnswer}) {
  return <div className='question'>
    <h4>{question.question}</h4>
    {question.answers.map((answer, index) => {
      let input = null;
      let correct = null;
      if (typeof correctAnswer !== 'undefined') {
        correct = <span>{index === correctAnswer ? 'Correct' : 'Wrong'}</span>;
      } else {
        input = <input name={questionIndex} checked={chosenAnswer === index} type='radio' onChange={() => onAnswerChange(questionIndex, index)} />
      }
      return (
        <p className='answer' key={index}>
          {input}
          {answer.answer}
          {correct}
        </p>
      );
    })}
  </div>
}

function QuizTopList({topList}) {
  return <aside>
    <h4>TopList</h4>
    {topList.map(entry => {
      return <p key={entry._id}>{Math.round(entry.correction.correct / entry.correction.total * 100)}%</p>;
    })}
  </aside>
}

export default function QuizPage({match}) {
  let [quiz, setQuiz] = useState(null);
  let [answers, setAnswers] = useState([]);
  let [errorMsg, setErrorMsg] = useState('');
  let [correctAnswers, setCorrectAnswers] = useState([]);
  let [correction, setCorrection] = useState(null);
  let quizId = match.params.id;
  useEffect(() => {
    axios.get('/api/quiz/' + quizId)
      .then(res => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      });
  }, []);

  function onAnswerChange(questionIndex, answerIndex) {
    let newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (answers.some(x => x === null)) {
      setErrorMsg('You\'re not done');
    } else {
      setErrorMsg('Submitting...');
      axios.post('/api/quiz/' + quizId + '/entry', {answers})
        .then(res => {
          setCorrectAnswers(res.data.correctAnswers);
          setCorrection({
            total: res.data.total,
            correct: res.data.correct,
          });
          setErrorMsg('');
        })
        .then(() => {
          axios.get('/api/quiz/' + quizId)
            .then(res => {
              setQuiz(res.data);
            });
        });
    }
  }

  if (quiz === null) return <p>Loading...</p>;
  let correctionElement = null;
  if (correction) {
    correctionElement = <p>{correction.correct} / {correction.total}</p>;
  }
  return <div>
    <QuizTopList topList={quiz.topList} />
    <h3>{quiz.name}</h3>
      {quiz.questions.map((question, index) => {
        return <QuizQuestion key={index} question={question} questionIndex={index} onAnswerChange={onAnswerChange} chosenAnswer={answers[index]} correctAnswer={correctAnswers[index]} />;
      })}
      <p>{errorMsg}</p>
      {correctionElement}
      {!correctionElement && <button onClick={onSubmit}>Done</button>}
  </div>
}
