const moment = require('moment');
const React = require('react');
const db = require('../../db');
const Finished = require('./finished');
const helper = require('./helper');
const Options = require('./options');
const Running = require('./running');

class MathDrill extends React.Component {
  static save(keyValuePair) {
    const options = db.getOptions();
    if (!options || !keyValuePair || !keyValuePair.hasOwnProperty) {
      return;
    }

    Object.keys(options).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(keyValuePair, key)) {
        options[key] = keyValuePair[key];
      }
    });

    db.saveOptions(options);
  }

  constructor() {
    super();

    const options = db.getOptions();

    this.state = {
      largeKeyboard: options.largeKeyboard,
      currentTask: [],
      levelIndex: options.levelIndex,
      minutes: options.minutes,
      onscreenKeyboard: options.onscreenKeyboard,
      opIndexes: options.opIndexes,
      previousResults: [], // previousResults results of quiz
      totalProblems: options.totalProblems,
      userName: options.userName,
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
    if (timeLeft <= 0) {
      this.endQuiz({ timeLeft });
    } else {
      this.setState({
        timeLeft,
      });
    }
  }

  onStart() {
    this.setNextTask();
    const {
      levelIndex,
      minutes = '1',
      opIndexes,
      totalProblems,
    } = this.state;
    const seconds = parseFloat(minutes, 10) * 60;
    const startTime = moment();
    const endTime = moment().add(seconds, 'seconds');
    const timerId = setInterval(this.onInterval, 1000);
    const currentRecord = helper.getCurrentRecord(levelIndex, opIndexes);
    this.setState({
      currentAction: 'running',
      currentRecord,
      endTime,
      questionsRemaining: parseInt(totalProblems, 10),
      seconds,
      startTime,
      timeLeft: seconds,
      timerId,
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

  endQuiz(otherState = {}) {
    const { timerId } = this.state;
    clearInterval(timerId);
    // Need to do this to get latest results. Merging in otherState
    // with state will provide the final results. We can't rely on
    // a call to this.setState() in a previous method because it batches
    // its calls and may not have updated state.
    const state = Object.assign(
      {},
      this.state,
      otherState,
    );
    const resultInfo = helper.appendScore(state);
    this.setState(Object.assign({
      currentAction: 'finished',
      timerId: null,
    }, otherState, { resultInfo }));
  }

  // eslint-disable-next-line react/sort-comp
  static currentMatchesLast(task, previousResults) {
    if (!previousResults.length) {
      return false;
    }
    const lastResult = previousResults[previousResults.length - 1];
    const { task: lastTask } = lastResult;
    return task.length === 4 && task.every((t, i) => t === lastTask[i]);
  }

  checkAnswer(answer) {
    const actual = parseInt(answer, 10);
    let { totalProblems } = this.state;
    const { startTime } = this.state;
    totalProblems = parseInt(totalProblems, 10);
    if (!isNaN(actual)) {
      const { currentTask: task, previousResults = [] } = this.state;
      let { correctCount = 0, totalCount } = this.state;
      totalCount += 1;
      let { previousTime = startTime } = this.state;
      const timeTaken = parseFloat((moment().diff(previousTime) / 1000).toFixed(1));

      const [,,, expected] = task;
      const correct = actual === expected;
      if (correct) {
        correctCount += 1;
        previousTime = moment();
      }
      // If first time wrong then push onto previousResults
      // otherwise replace last element in previousResults
      // If correct and was previously wrong then replace otherwise push.
      // If problem exists at end of array then replace otherwise push.
      // A task is an array of:  left, right, opIndex, expectedAnswer
      // and problems are not repeated so a first time can be checked using this.
      if (MathDrill.currentMatchesLast(task, previousResults)) {
        const current = previousResults[previousResults.length - 1];
        current.actuals.unshift(actual);
        current.timeTaken = timeTaken;
      } else {
        const actuals = [actual];
        previousResults.push({
          task, actuals, timeTaken, id: previousResults.length,
        });
      }

      const otherState = {
        correct,
        correctCount,
        previousTime,
        result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
        previousResults,
        totalCount,
        questionsRemaining: totalProblems - correctCount,
      };

      if (correctCount === totalProblems) {
        this.endQuiz(otherState);
      } else {
        this.setState(otherState);
        if (correct) {
          this.setNextTask();
        }
      }
    }
  }

  renderOptions() {
    const {
      largeKeyboard,
      levelIndex,
      minutes,
      onscreenKeyboard,
      opIndexes,
      totalProblems,
      userName,
    } = this.state || {};

    return (
      <Options
        largeKeyboard={largeKeyboard}
        levelIndex={levelIndex}
        minutes={minutes}
        onChange={this.onChange}
        onscreenKeyboard={onscreenKeyboard}
        onStart={this.onStart}
        opIndexes={opIndexes}
        setParentState={this.setParentState}
        totalProblems={totalProblems}
        userName={userName}
      />
    );
  }

  renderRunning() {
    const {
      currentRecord,
      currentTask,
      largeKeyboard,
      levelIndex,
      onscreenKeyboard,
      opIndexes,
      previousResults,
      questionsRemaining,
      startTime,
      timeLeft,
    } = this.state;

    return (
      <Running
        checkAnswer={this.checkAnswer}
        currentTask={currentTask}
        largeKeyboard={largeKeyboard}
        levelIndex={levelIndex}
        onscreenKeyboard={onscreenKeyboard}
        opIndexes={opIndexes}
        previousResults={previousResults}
        questionsRemaining={questionsRemaining}
        timeLeft={timeLeft}
        newRecord={helper.newRecord({ currentRecord, previousResults, startTime })}
      />
    );
  }

  renderFinished() {
    const {
      previousResults,
      resultInfo,
      seconds,
      timeLeft,
      totalProblems,
      levelIndex,
      opIndexes,
    } = this.state;
    return (
      <Finished
        levelIndex={levelIndex}
        opIndexes={opIndexes}
        previousResults={previousResults}
        resultInfo={resultInfo}
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
