
class BaseArray {
  constructor(initial) {
    if (initial && !Array.isArray(initial)) {
      throw new Error(`If an initial value is passed to BaseArray constructor it must be an array but it was ${typeof initial}`);
    }
    this.array = initial || [];
  }

  first() {
    return this.array[0];
  }

  last() {
    return this.array.length
      ? this.array[this.array.length - 1]
      : undefined;
  }

  push(item) {
    this.array.push(item);
  }
}

class PreviousResults extends BaseArray {
  getStats() {
    return this.array.reduce((acc, problem) => {
      const { task, actual, timeTaken } = problem;
      const [,,, answer] = task;

      const {
        incorrects,
      } = acc;
      let {
        correctCount,
        longestTime,
        shortestTime,
      } = acc;

      if (!longestTime) {
        longestTime = problem;
      } else {
        const { timeTaken: currentLongTime } = longestTime;

        if (currentLongTime < timeTaken) {
          longestTime = problem;
        }
      }

      if (!shortestTime) {
        shortestTime = problem;
      } else {
        const { timeTaken: currentShortTime } = shortestTime;

        if (currentShortTime > timeTaken) {
          shortestTime = problem;
        }
      }


      if (answer === actual) {
        correctCount += 1;
      } else {
        incorrects.push(problem);
      }

      return {
        correctCount,
        incorrects,
        longestTime,
        shortestTime,
        totalTime: acc.totalTime + timeTaken,
      };
    }, { correctCount: 0, incorrects: [], totalTime: 0 });
  }
}

module.exports = PreviousResults;
