
class PreviousResults {
  constructor(initialResults) {
    if (initialResults && !Array.isArray(initialResults)) {
      throw new Error(`If an initialValue is passed to PreviousResults constructor it must be an array but it was ${typeof initialResults}`);
    }
    this.results = initialResults || [];
  }

  first() {
    return this.results[0];
  }

  last() {
    return this.results.length
      ? this.results[this.results.length - 1]
      : undefined;
  }

  getStats() {
    return this.results.reduce((acc, problem) => {
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
