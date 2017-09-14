const helper = require('./helper');
const moment = require('moment');
const Options = require('./options');
const React = require('react');
const Running = require('./running');
const Finished = require('./finished');

class MathDrill extends React.Component {
  static save(keyValuePair) {
    let options = localStorage.getItem('mathDrillOptions');
    if (!options || !keyValuePair || !keyValuePair.hasOwnProperty) {
      return;
    }
    options = JSON.parse(options);
    Object.keys(options).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(keyValuePair, key)) {
        options[key] = keyValuePair[key];
      }
    });

    localStorage.setItem('mathDrillOptions', JSON.stringify(options));
  }

  constructor() {
    super();

    localStorage.getItem('mathDrillOptions');
    let options = localStorage.getItem('mathDrillOptions');
    if (options) {
      options = JSON.parse(options);
      if (options.opIndex) {
        options.opIndexes = [options.opIndex];
        delete options.opIndex;
        localStorage.setItem('mathDrillOptions', JSON.stringify(options));
      }
    } else {
      options = {
        levelIndex: 0, // A
        minutes: '1',
        onscreenKeyboard: true,
        opIndexes: [0], // +
        totalProblems: '20',
      };
      localStorage.setItem('mathDrillOptions', JSON.stringify(options));
    }

    this.state = {
      currentTask: [],
      levelIndex: options.levelIndex,
      minutes: options.minutes,
      onscreenKeyboard: options.onscreenKeyboard,
      opIndexes: options.opIndexes,
      previousResults: [], // previousResults results of quiz
      totalProblems: options.totalProblems,
    };

    this.checkAnswer = this.checkAnswer.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStart = this.onStart.bind(this);
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
    const { name } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const kvp = { [name]: value };
    this.setState(kvp);
    MathDrill.save(kvp);
  }

  setParentState(state) {
    this.setState(state);
    MathDrill.save(state);
  }

  setNextTask() {
    const { levelIndex, opIndexes, currentTask } = this.state;
    const nextTask = helper.getLowerUpper(levelIndex, opIndexes);

    if (nextTask.every((item, index) => currentTask[index] === item)) {
      this.setNextTask();
    } else {
      this.setState({
        currentTask: nextTask,
      });
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
      opIndexes,
      totalProblems,
    } = this.state || {};

    return (
      <Options
        levelIndex={levelIndex}
        minutes={minutes}
        onChange={this.onChange}
        onscreenKeyboard={onscreenKeyboard}
        onStart={this.onStart}
        opIndexes={opIndexes}
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
      opIndexes,
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
        opIndexes={opIndexes}
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
