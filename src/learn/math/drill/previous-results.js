
class PreviousResults {
  static sortBySlowest(previousResults = []) {
    return previousResults.sort((a, b) => b.timeTaken - a.timeTaken);
  }

  static getStats(previousResults = []) {
    return previousResults.reduce((acc, problem) => {
      const { task, actuals, timeTaken } = problem;
      const [actual] = actuals;
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
      }
      if (actuals.length > 1 || answer !== actual) {
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
