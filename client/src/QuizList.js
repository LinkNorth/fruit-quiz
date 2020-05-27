import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function QuizList() {
  let [quizes, setQuizes] = useState(null);
  useEffect(() => {
    axios.get('/api')
      .then(res => {
        setQuizes(res.data.data);
      });
  }, []);

  if (quizes === null) return <p>Loading...</p>;
  return <div>
    {quizes.map(quiz => {
      return <p key={quiz._id}><Link to={`/quiz/${quiz._id}`}>{quiz.name} - num questions: {quiz.numQuestions}</Link></p>;
    })}
  </div>
}
