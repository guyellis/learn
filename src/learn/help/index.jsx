const React = require('react');
const Typography = require('@material-ui/core/Typography').default;
const Divider = require('@material-ui/core/Divider').default;
const useStyles = require('./indexStyles');

const help = () => {
  const classes = useStyles();

  const helpSection = (
    <>
      <Typography variant="h5" gutterBottom>
Options
      </Typography>
      <Typography component="p">
Configure the options for the test. These options get saved in your browser
so if you visit this page again with the same browser then the settings
will be as you last left them.
        <br />
The scores and badges are also saved in the browser. There is no server or
database for this app. Everything happens on your device and in the browser
and that&apos;s where all the data lives as well. If you use a different browser
you will start from fresh. If you share your browser with somebody they&apos;ll have
your settings and scores.
      </Typography>
    </>
  );
  const levelSection = (
    <>
      <Typography variant="h5" gutterBottom>
Level
      </Typography>
      <Typography component="p">
There are 26 levels from A to Z. If you select a different level the previous
one will be deselected. All levels are cumulative meaning that, for example
on level E you will also get questions from levels A through D. The questions
are randomly weighted towards the higher level you select. That means that
if you select level E there will probably be more questions from this level
than level D and there will be more from level D than from C etc.
      </Typography>
    </>
  );
  const operationSection = (
    <>
      <Typography variant="h5" gutterBottom>
Operation
      </Typography>
      <Typography component="p">
The four operators Addition, Subtraction, Multiplication and Division can be
selected in any combination. At least one of them needs to be selected and all
four can be selected as well.
        <br />
Because all Operations can be selected and because the Levels are cumulative you
can get all four operations with all levels by selecting all the Operators and
Level Z.
      </Typography>
    </>
  );
  const timeSection = (
    <>
      <Typography variant="h5" gutterBottom>
Time
      </Typography>
      <Typography component="p">
The time is expressed in minutes and will stop the test after this time period
has elapsed. Fractions of a minute can be used to refine the time. Time is not
really important if you are collecting badges (see below) because average time
becomes the deciding factor so setting this to a high value is okay.
      </Typography>
    </>
  );
  const totalQuestionsSection = (
    <>
      <Typography variant="h5" gutterBottom>
Total Questions
      </Typography>
      <Typography component="p">
This is the total number of questions that will be asked. The test will end
once this number of questions have been correctly answered. If a question is not
correctly answered then the test will remain on that question until it is
complete.
        <br />
If you want to collect badges for completed tests you must answer at least ten
questions in each test.
      </Typography>
    </>
  );
  const keyboardSection = (
    <>
      <Typography variant="h5" gutterBottom>
Keyboard
      </Typography>
      <Typography component="p">
If you&apos;re doing this on a touch device like a smart phone or tablet the the
onscreen keyboard is the easiest to use. It&apos;s a simple keyboard that has all
the functionality you need.
        <br />
If you doing this from a desktop computer or laptop then switching this off
is probably going to be easier.
        <br />
Try them both and see which one works best for you.
      </Typography>
    </>
  );
  const largeKeyboardSection = (
    <>
      <Typography variant="h5" gutterBottom>
Large Keyboard
      </Typography>
      <Typography component="p">
This will only show up if you have selected &ldquo;onscreen keyboard.&ldquo; Selecting
this option will increase the size of the onscreen keyboard. It seems to
make it easier for kids to use a larger keyboard sometimes.
      </Typography>
    </>
  );
  const yourNameSection = (
    <>
      <Typography variant="h5" gutterBottom>
Your Name
      </Typography>
      <Typography component="p">
This is entirely optional.
      </Typography>
    </>
  );
  const runningSection = (
    <>
      <Typography variant="h5" gutterBottom>
Running
      </Typography>
      <Typography component="p">
Once you start running the test you will see the Level, Operation(s)
Time Left and Questions Remaining at the top of the screen.
        <br />
The current question will be presented right below that with a ? in a green
box where the answer will go.
        <br />
Answering a question correctly will advance to the next question until they
are all completed or until time runs out.
        <br />
After you have started answering questions two more pieces of information
will be presented under the question. The result of the previous question
you answered and your current speed versus the record (if there is one).
      </Typography>
    </>
  );
  const finishedSection = (
    <>
      <Typography variant="h5" gutterBottom>
Finished
      </Typography>
      <Typography component="p">
Once you have completed answering all your questions you&apos;ll see the results
on the Finished page.
        <br />
If you have earned a new badge you will see that here as well.
        <br />
There is also a summary of the question you answered quickest, slowest and
all your results if you want to review them.
      </Typography>
    </>
  );
  const scoreboardSection = (
    <>
      <Typography variant="h5" gutterBottom>
Scoreboard
      </Typography>
      <Typography component="p">
The scoreboard is fairly obvious.
        <br />
There is a summary at the top showing all the badges you have earned.
        <br />
Below that is a table showing badges by level and operation.
        <br />
For now badges are only awarded for single-operation tests.
      </Typography>
    </>
  );
  return (
    <div>
      <Typography variant="h2" gutterBottom>
Help
      </Typography>
      {helpSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {levelSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {operationSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {timeSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {totalQuestionsSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {keyboardSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {largeKeyboardSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {yourNameSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {runningSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {finishedSection}
      <div className={classes.divider}>
        <Divider />
      </div>
      {scoreboardSection}
    </div>
  );
};

module.exports = help;
