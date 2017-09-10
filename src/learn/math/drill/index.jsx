const helper = require('./helper');
const moment = require('moment');
const Options = require('./options');
const React = require('react');
const Running = require('./running');
const Finished = require('./finished');

function getScores() {
  let scores;
  try {
    scores = JSON.parse(localStorage.getItem('scores') || '[]');
  } catch (e) {
    scores = [];
  }
  return scores;
}

class MathDrill extends React.Component {
  constructor() {
    super();

    // TODO: opIndex, levelIndex to localStorage and restore at startup
    this.state = {
      currentTask: [],
      levelIndex: 0, // A
      lower: 1,
      opIndex: 0, // +
      previousResults: [], // previousResults results of quiz
      upper: 3,
      minutes: '1',
      totalProblems: '20',
      onscreenKeyboard: true,
    };

    this.checkAnswer = this.checkAnswer.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStart = this.onStart.bind(this);
    this.save = this.save.bind(this);
    this.setNextTask = this.setNextTask.bind(this);
    this.onInterval = this.onInterval.bind(this);
    this.setParentState = this.setParentState.bind(this);
  }

  onInterval() {
    const {
      endTime,
    } = this.state;
    const timeLeft = Math.round(endTime.diff(moment()) / 1000);
    let { currentAction } = this.state;
    if (timeLeft <= 0) {
      clearInterval(this.state.timerId);
      currentAction = 'finished';
    }
    this.setState({
      currentAction,
      timeLeft,
    });
  }

  onStart() {
    this.setNextTask();
    const { minutes = '1', totalProblems } = this.state;
    const seconds = parseFloat(minutes, 10) * 60;
    const startTime = moment();
    const endTime = moment().add(seconds, 'seconds');
    const timerId = setInterval(this.onInterval, 1000);
    this.setState({
      currentAction: 'running',
      startTime,
      endTime,
      timerId,
      seconds,
      timeLeft: seconds,
      questionsRemaining: parseInt(totalProblems, 10),
    });
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  setParentState(state) {
    this.setState(state);
  }

  setNextTask() {
    const { levelIndex, opIndex, currentTask } = this.state;
    const nextTask = helper.getLowerUpper(levelIndex, opIndex);

    if (nextTask.every((item, index) => currentTask[index] === item)) {
      this.setNextTask();
    } else {
      this.setState({
        currentTask: nextTask,
      });
    }
  }

  save() {
    const {
      startTime,
      correctCount,
      totalCount,
    } = this.state;
    if (totalCount) {
      const scores = getScores();
      const {
        lower,
        sign,
        upper,
      } = this.state;
      scores.unshift({
        correctCount,
        date: new Date().toISOString(),
        lower,
        sign,
        time: Math.round((Date.now() - startTime) / 1000),
        totalCount,
        upper,
      });
      if (scores.length > 10) {
        scores.pop();
      }
      localStorage.setItem('scores', JSON.stringify(scores));
      this.setState({ scores });
      this.reset();
    }
  }

  checkAnswer(answer) {
    const actual = parseInt(answer, 10);
    let { currentAction, totalProblems } = this.state;
    totalProblems = parseInt(totalProblems, 10);
    if (!isNaN(actual)) {
      const { currentTask: task, previousResults = [] } = this.state;
      let { correctCount = 0, totalCount } = this.state;
      totalCount += 1;
      const [,,, expected] = task;
      const correct = actual === expected;
      if (correct) {
        correctCount += 1;
      }

      if (correctCount === totalProblems) {
        clearInterval(this.state.timerId);
        currentAction = 'finished';
      }

      const { previousTime = this.state.startTime } = this.state;
      const timeTaken = Math.round(moment().diff(previousTime) / 100) / 10;

      previousResults.push({ task, actual, timeTaken, id: previousResults.length });
      this.setState({
        correct,
        correctCount,
        previousTime: moment(),
        result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
        previousResults,
        totalCount,
        currentAction,
        questionsRemaining: totalProblems - correctCount,
      });

      if (correct) {
        this.setNextTask();
      }
    }
  }

  renderOptions() {
    const {
      levelIndex,
      minutes,
      onscreenKeyboard,
      opIndex,
      totalProblems,
    } = this.state || {};
    return (
      <Options
        levelIndex={levelIndex}
        minutes={minutes}
        onChange={this.onChange}
        onscreenKeyboard={onscreenKeyboard}
        onStart={this.onStart}
        opIndex={opIndex}
        setParentState={this.setParentState}
        totalProblems={totalProblems}
      />
    );
  }

  renderRunning() {
    const {
      currentTask,
      levelIndex,
      onscreenKeyboard,
      opIndex,
      previousResults,
      questionsRemaining,
      timeLeft,
    } = this.state;

    return (
      <Running
        checkAnswer={this.checkAnswer}
        currentTask={currentTask}
        levelIndex={levelIndex}
        onscreenKeyboard={onscreenKeyboard}
        opIndex={opIndex}
        previousResults={previousResults}
        questionsRemaining={questionsRemaining}
        timeLeft={timeLeft}
      />
    );
  }

  renderFinished() {
    const {
      previousResults,
      seconds,
      timeLeft,
      totalProblems,
    } = this.state;
    return (
      <Finished
        previousResults={previousResults}
        timeAllowed={seconds}
        timeLeft={timeLeft}
        totalProblems={parseInt(totalProblems, 10)}
      />
    );
  }

  render() {
    const {
      currentAction = 'start',
    } = this.state || {};
    switch (currentAction) {
      case 'start':
        return this.renderOptions();
      case 'running':
        return this.renderRunning();
      case 'finished':
        return this.renderFinished();
      default:
        // eslint-disable-next-line no-console
        console.error(`Unknown currentAction ${currentAction}`);
        return null;
    }
  }
}

module.exports = MathDrill;
