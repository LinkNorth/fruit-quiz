import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import './CreateQuiz.css';

class QuestionAnswerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
    };
    this.correctRef = React.createRef();
  }

  getState() {
    return {
      answer: this.state.answer,
      correct: this.correctRef.current.checked,
    };
  }

  setAnswer(value) {
    this.setState({
      answer: value,
    });
  }

  setCorrectAnswer(value) {
    this.setState({
      correct: value,
    });
  }

  render() {
    return <div>
      <input type="text" value={this.state.answer} onChange={e => this.setAnswer(e.target.value)} />
      <input type="radio" name={this.props.questionId} ref={this.correctRef} />
    </div>;
  }
}

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      numAnswers: 0,
    };
    this.answerRefs = [];
    this.setNumAnswers = this.setNumAnswers.bind(this);
    this.setQuestion = this.setQuestion.bind(this);
  }

  getState() {
    return {
      question: this.state.question,
      answers: this.answerRefs.map(x => {
        return x.current.getState();
      }),
    };
  }

  setNumAnswers(value) {
    this.setState({numAnswers: value});
    this.answerRefs = [];
    for (let i = 0; i < value; i += 1) {
      this.answerRefs.push(React.createRef());
    }
  }

  setQuestion(value) {
    this.setState({question: value});
  }

  render() {
    let answersElements = [];
    for (let i = 0; i < this.state.numAnswers; i += 1) {
      let answerEl = <QuestionAnswerForm ref={this.answerRefs[i]} questionId={this.props.questionId} key={i} index={i} />;
      answersElements.push(answerEl);
    }

    return <div>
      <input type="text" name="question" value={this.state.question} onChange={e => this.setQuestion(e.target.value)} />
      <input type="number" value={this.state.numAnswers} onChange={e => this.setNumAnswers(e.target.value)} />
      <div className='answers'>
        {answersElements}
      </div>
    </div>
  }
}

export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      numQuestions: 0,
      redirect: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.setName = this.setName.bind(this);
    this.setNumQuestions = this.setNumQuestions.bind(this);
    this.questionRefs = [];
  }

  onSubmit(e) {
    e.preventDefault();
    let state = {
      name: this.state.name,
      questions: this.questionRefs.map(x => x.current.getState()),
    };

    axios.post('/api/quiz', state)
      .then(() => {
        this.setState({redirect: true});
      });
  }

  setName(value) {
    this.setState({
      name: value,
    });
  }

  setNumQuestions(value) {
    this.setState({
      numQuestions: value, 
    });
    this.questionRefs = [];
    for (let i = 0; i < value; i += 1) {
      this.questionRefs.push(React.createRef());
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    let questionsEls = [];
    for (let i = 0; i < this.state.numQuestions; i += 1) {
      questionsEls.push(<QuestionForm ref={this.questionRefs[i]} key={i} index={i} questionId={i} />);
    }

    return <form onSubmit={this.onSubmit}>
      <label>
          Name of quiz:
        <input type="text" name="name" onChange={e => this.setName(e.target.value)} value={this.state.name} />
      </label>
      <input type="number" value={this.state.numQuestions} onChange={e => this.setNumQuestions(e.target.value)} />
      <div className='questions'>
        {questionsEls}
      </div>
      <button type="submit">Create Quiz</button>
    </form>
  }
}
