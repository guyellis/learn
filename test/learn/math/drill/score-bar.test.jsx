import React from 'react';
import renderer from 'react-test-renderer';
import ScoreBar from '../../../../src/learn/math/drill/score-bar.jsx';

function mockDates(times) {
  Date.now = vi.fn();
  times.forEach((time) => {
    const mockDate = time.date + time.dateMockDelta;
    Date.now.mockImplementationOnce(() => mockDate);
  });
}

describe('ScoreBar', () => {
  const nowFn = Date.now;
  afterAll(() => {
    Date.now = nowFn;
  });

  test('should not show if showScoreBar is false', () => {
    const times = [];

    const component = renderer.create(<ScoreBar
      showScoreBar={false}
      times={times}
    />);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should not show if times is empty', () => {
    const times = [];

    const component = renderer.create(<ScoreBar
      showScoreBar
      times={times}
    />);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 1 column with Gold Badge', () => {
    const times = [{
      date: 1506395542848, // 9/25/2017 8:12pm PST
      timePerQuestion: 1.5,
      dateMockDelta: 1000 * 60 * 4,
    }];

    mockDates(times);

    const component = renderer.create(<ScoreBar
      showScoreBar
      times={times}
    />);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 1 column with below Blue Badge', () => {
    const times = [{
      date: 1506395542848, // 9/25/2017 8:12pm PST
      timePerQuestion: 15.2,
      dateMockDelta: 1000 * 60 * 4,
    }];

    mockDates(times);

    const component = renderer.create(<ScoreBar
      showScoreBar
      times={times}
    />);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 5 columns with mixed Badges', () => {
    const times = [{
      date: 1506395542848, // 9/25/2017 8:12pm PST
      timePerQuestion: 15.2,
      dateMockDelta: 1000 * 60 * 4,
    }, {
      date: 1506395642848, // A bit later
      timePerQuestion: 10.2,
      dateMockDelta: 1000 * 60 * 2,
    }, {
      date: 1506395742848, // And later
      timePerQuestion: 5.2,
      dateMockDelta: 1000 * 3,
    }];

    mockDates(times);

    const component = renderer.create(<ScoreBar
      showScoreBar
      times={times}
    />);

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });
});
