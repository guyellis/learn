const React = require('react');
const ReactMarkdown = require('react-markdown');

const input = `
### Help with Math Drill

#### Options

Configure the options for the test. These options get saved in your browser \
so if you visit this page again with the same browser then the settings \
will be as you last left them.

The scores and badges are also saved in the browser. There is no server or \
database for this app. Everything happens on your device and in the browser \
and that's where all the data lives as well. If you use a different browser \
you will start from fresh. If you share your browser with somebody they'll have \
your settings and scores.

##### Level

There are 26 levels from A to Z. If you select a different level the previous \
one will be deselected. All levels are cumulative meaning that, for example \
on level E you will also get questions from levels A through D. The questions \
are randomly weighted towards the higher level you select. That means that \
if you select level E there will probably be more questions from this level \
than level D and there will be more from level D than from C etc.

##### Operation

The four operators Addition, Subtraction, Multiplication and Division can be \
selected in any combination. At least one of them needs to be selected and all \
four can be selected as well.

Because all Operations can be selected and because the Levels are cumulative you \
can get all four operations with all levels by selecting all the Operators and \
Level Z.

##### Time

The time is expressed in minutes and will stop the test after this time period \
has elapsed. Fractions of a minute can be used to refine the time. Time is not \
really important if you are collecting badges (see below) because average time \
becomes the deciding factor so setting this to a high value is okay.

##### Total Questions

This is the total number of questions that will be asked. The test will end \
once this number of questions have been correctly answered. If a question is not \
correctly answered then the test will remain on that question until it is \
complete.

If you want to collect badges for completed tests you must answer at least ten \
questions in each test.

##### Keyboard

If you're doing this on a touch device like a smart phone or tablet the the \
onscreen keyboard is the easiest to use. It's a simple keyboard that has all
the functionality you need.

If you doing this from a desktop computer or laptop then switching this off \
is probably going to be easier.

Try them both and see which one works best for you.

##### Large Keyboard

This will only show up if you have selected "onscreen keyboard." Selecting \
this option will increase the size of the onscreen keyboard. It seems to \
make it easier for kids to use a larger keyboard sometimes.

##### Your Name

This is entirely optional.

### Running

One you start running the test you will see the Level, Operation(s) \
Time Left and Questions Remaing at the top of the screen.

The current question will be presented right below that with a ? in a green \
box where the answer will go.

Answering a question correctly will advance to the next question until they \
are all completed or until time runs out.

After you have started answering questions two more pieces of information \
will be presented under the question. The result of the previous question \
you answered and your current speed versus the record (if there is one).

### Finished

Once you have completed answering all your questions you'll see the results \
on the Finished page.

If you have earned a new badge you will see that here as well.

There is also a summary of the question you answered quickets, slowest and \
all your results if you want to review them.

# Scoreboard

The scoreboard is fairly obvious.

There is a summary at the top showing all the badges you have earned.

Below that is a table showing badges by level and operation.

For now badges are only awarded for single-operation tests.
`;

function help() {
  return (
    <ReactMarkdown source={input} />
  );
}

module.exports = help;
