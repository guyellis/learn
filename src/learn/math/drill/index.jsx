import { Temporal } from '@js-temporal/polyfill';
import React from 'react';
import db from '../../db/index.js';
import Finished from './finished.jsx';
import helper from './helper.js';
import Options from './options.jsx';
import Running from './running.jsx';

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

    // TODO: Fix and remove this ESLint disable
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      currentTask: [],
      largeKeyboard: options.largeKeyboard,
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

  componentWillUnmount() {
    const { timerId } = this.state;
    if (timerId) {
      clearInterval(timerId);
    }
  }

  onInterval() {
    const { endTime } = this.state;
    const endInstant = helper.toInstant(endTime);
    const timeLeft = Math.round(endInstant.since(Temporal.Now.instant()).total({ unit: 'second' }));
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
    const { levelIndex, minutes = '1', opIndexes, totalProblems } = this.state;
    const seconds = parseFloat(minutes, 10) * 60;
    const startTime = Temporal.Now.instant();
    const endTime = startTime.add(Temporal.Duration.from({ seconds }));
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
    const { currentTask, levelIndex, opIndexes } = this.state;
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
    const state = {
      ...this.state,
      ...otherState,
    };
    const resultInfo = helper.appendScore(state);
    this.setState({
      currentAction: 'finished',
      timerId: null,
      ...otherState,
      resultInfo,
    });
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
      const prevInstant = helper.toInstant(previousTime);
      const timeTaken = parseFloat(
        Temporal.Now.instant().since(prevInstant).total({ unit: 'second' }).toFixed(1),
      );

      const [, , , expected] = task;
      const correct = actual === expected;
      if (correct) {
        correctCount += 1;
        previousTime = Temporal.Now.instant();
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
          actuals,
          id: previousResults.length,
          task,
          timeTaken,
        });
      }

      const otherState = {
        correct,
        correctCount,
        previousResults,
        previousTime,
        questionsRemaining: totalProblems - correctCount,
        result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
        totalCount,
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
        newRecord={helper.newRecord({ currentRecord, previousResults, startTime })}
        onscreenKeyboard={onscreenKeyboard}
        opIndexes={opIndexes}
        previousResults={previousResults}
        questionsRemaining={questionsRemaining}
        timeLeft={timeLeft}
      />
    );
  }

  renderFinished() {
    const { levelIndex, opIndexes, previousResults, resultInfo, seconds, timeLeft, totalProblems } =
      this.state;
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
    const { currentAction = 'start' } = this.state || {};
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

export default MathDrill;
