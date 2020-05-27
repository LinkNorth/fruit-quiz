import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import CreateQuiz from './CreateQuiz';
import QuizPage from './QuizPage';
import QuizList from './QuizList';

function App() {
  return (
    <div className="App">
      <Router>
        <h1>Welcome to fruit-quiz</h1>
        <nav>
          <Link to="/">Quizes</Link>
          <Link to="/create-quiz">Create quiz</Link>
        </nav>
        <div className='content'>
          <Route exact path="/">
            <QuizList />
          </Route>
          <Route exact path="/quiz/:id" component={QuizPage} />
          <Route path="/create-quiz">
            <CreateQuiz />
          </Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
