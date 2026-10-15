import React from 'react';
import db from '../../db/index.js';
import Finished from './finished.js';
import helper from './helper.js';
import Options from './options.js';
import Running from './running.js';
import type {
  DrillOptions,
  DrillResults,
  DrillTask,
  PreviousResult,
  ResultInfo,
  ScoreRecord,
} from './types.js';

export interface MathDrillProps {
  key?: React.Key;
}

export interface MathDrillState {
  asked: Set<string>;
  correct?: boolean;
  correctCount?: number;
  currentAction?: 'finished' | 'running' | 'start';
  currentRecord?: ScoreRecord | null;
  currentTask: DrillTask;
  endTime?: Temporal.Instant;
  levelIndex: number;
  minutes: string;
  opIndexes: number[];
  previousResults: PreviousResult[];
  previousTime?: Temporal.Instant;
  questionsRemaining: number;
  result?: string;
  resultInfo?: ResultInfo;
  seconds: number;
  startTime?: Temporal.Instant;
  timeLeft: number;
  timerId?: NodeJS.Timeout | number | null;
  totalCount: number;
  totalProblems: string;
  userName: string;
}

class MathDrill extends React.Component<MathDrillProps, MathDrillState> {
  static save(keyValuePair: Record<string, unknown>) {
    const options = db.getOptions() as unknown as Record<string, unknown>;
    if (!options || !keyValuePair || !keyValuePair.hasOwnProperty) {
      return;
    }

    Object.keys(options).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(keyValuePair, key)) {
        options[key] = keyValuePair[key];
      }
    });

    db.saveOptions(options as unknown as DrillOptions);
  }

  constructor(props: MathDrillProps) {
    super(props);

    const options = db.getOptions();

    // TODO: Fix and remove this ESLint disable
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      asked: new Set<string>(),
      currentTask: [] as unknown as DrillTask,
      levelIndex: options.levelIndex,
      minutes: options.minutes,
      opIndexes: options.opIndexes,
      previousResults: [], // previousResults results of quiz
      questionsRemaining: 0,
      seconds: 0,
      timeLeft: 0,
      totalCount: 0,
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
      clearInterval(timerId as number);
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
    const asked = new Set<string>();
    this.setNextTask(asked);
    const { levelIndex, minutes, opIndexes, totalProblems } = this.state;
    const seconds = parseFloat(minutes) * 60;
    const startTime = Temporal.Now.instant();
    const endTime = startTime.add(Temporal.Duration.from({ seconds }));
    const timerId = setInterval(this.onInterval, 1000);
    const currentRecord = helper.getCurrentRecord(levelIndex, opIndexes);
    this.setState({
      currentAction: 'running',
      currentRecord,
      endTime,
      previousTime: undefined,
      questionsRemaining: parseInt(totalProblems, 10),
      seconds,
      startTime,
      timeLeft: seconds,
      timerId,
    });
  }

  onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    const value =
      (e.target as HTMLInputElement).type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    const kvp = { [name]: value };
    this.setState(kvp as unknown as Pick<MathDrillState, keyof MathDrillState>);
    MathDrill.save(kvp);
  }

  setParentState(state: Partial<DrillOptions>) {
    this.setState(state as unknown as Pick<MathDrillState, keyof MathDrillState>);
    MathDrill.save(state);
  }

  setNextTask(overrideAsked?: Set<string>) {
    const { currentTask, levelIndex, opIndexes } = this.state;
    const asked = overrideAsked ?? this.state.asked;
    const pool = helper.getPool(levelIndex, opIndexes);

    let activeAsked = asked;
    let isNewCycle = false;
    if (activeAsked.size >= pool.size) {
      activeAsked = new Set([helper.toTupleKey(currentTask)]);
      isNewCycle = true;
    }

    const nextTask = helper.getNextTask(levelIndex, opIndexes, activeAsked);

    if (nextTask.every((item, index) => currentTask[index] === item)) {
      this.setNextTask(overrideAsked);
    } else {
      const nextTupleKey = helper.toTupleKey(nextTask);
      const newAsked = isNewCycle
        ? new Set([nextTupleKey])
        : new Set(activeAsked).add(nextTupleKey);
      this.setState({
        asked: newAsked,
        currentTask: nextTask,
      });
    }
  }

  endQuiz(otherState: Record<string, unknown> = {}) {
    const { timerId } = this.state;
    clearInterval(timerId as number);
    // Need to do this to get latest results. Merging in otherState
    // with state will provide the final results. We can't rely on
    // a call to this.setState() in a previous method because it batches
    // its calls and may not have updated state.
    const state = {
      ...this.state,
      ...otherState,
    };
    const resultInfo = helper.appendScore(state as unknown as DrillResults);
    this.setState((prevState) => ({
      ...prevState,
      ...otherState,
      currentAction: 'finished',
      resultInfo,
      timerId: null,
    }));
  }

  // eslint-disable-next-line react/sort-comp
  static currentMatchesLast(task: DrillTask, previousResults: PreviousResult[]) {
    if (!previousResults.length) {
      return false;
    }
    const lastResult = previousResults[previousResults.length - 1];
    const { task: lastTask } = lastResult;
    return task.length === 4 && task.every((t, i) => t === lastTask[i]);
  }

  checkAnswer(answer: string) {
    const actual = parseInt(answer, 10);
    const { endTime, startTime, timeLeft, totalProblems } = this.state;
    const totalProblemsNum = parseInt(totalProblems, 10);
    if (!isNaN(actual)) {
      const { currentTask: task, previousResults } = this.state;
      let { correctCount = 0, totalCount } = this.state;
      totalCount += 1;
      let { previousTime = startTime } = this.state;
      const prevInstant = helper.toInstant(previousTime);
      const timeTaken = parseFloat(
        Temporal.Now.instant().since(prevInstant).total({ unit: 'second' }).toFixed(1),
      );

      const [, , , expected] = task as DrillTask;
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
      // and problems are not repeated within a pool cycle so a first time can be checked using this.
      if (MathDrill.currentMatchesLast(task as DrillTask, previousResults)) {
        const current = previousResults[previousResults.length - 1];
        current.actuals.unshift(actual);
        current.timeTaken = timeTaken;
      } else {
        const actuals = [actual];
        previousResults.push({
          actuals,
          id: previousResults.length,
          task: task as DrillTask,
          timeTaken,
        });
      }

      let newTimeLeft = timeLeft;
      let newEndTime = endTime;
      if (!correct) {
        newTimeLeft = Math.max(0, timeLeft - 1);
        if (endTime) {
          const endInstant = helper.toInstant(endTime);
          newEndTime = endInstant.subtract(Temporal.Duration.from({ seconds: 1 }));
        }
      }

      const otherState = {
        correct,
        correctCount,
        endTime: newEndTime,
        previousResults,
        previousTime,
        questionsRemaining: totalProblemsNum - correctCount,
        result: `${actual} is ${correct ? 'correct' : 'wrong'}`,
        timeLeft: newTimeLeft,
        totalCount,
      };

      if (correctCount === totalProblemsNum || (!correct && newTimeLeft <= 0)) {
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
    const { levelIndex, minutes, opIndexes, totalProblems, userName } = this.state;

    return (
      <Options
        levelIndex={levelIndex}
        minutes={minutes}
        onChange={this.onChange}
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
      levelIndex,
      opIndexes,
      previousResults,
      previousTime,
      questionsRemaining,
      startTime,
      timeLeft,
    } = this.state;

    return (
      <Running
        checkAnswer={this.checkAnswer}
        currentTask={currentTask}
        levelIndex={levelIndex}
        newRecord={helper.newRecord({ currentRecord, previousResults, startTime })}
        opIndexes={opIndexes}
        previousResults={previousResults}
        questionsRemaining={questionsRemaining}
        questionStartTime={previousTime ?? startTime}
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
        resultInfo={resultInfo!}
        timeAllowed={seconds}
        timeLeft={timeLeft}
        totalProblems={parseInt(totalProblems, 10)}
      />
    );
  }

  render() {
    const { currentAction = 'start' } = this.state;
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
