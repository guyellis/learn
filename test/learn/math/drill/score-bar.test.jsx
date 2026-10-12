import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ScoreBar, { formatFromNow } from '../../../../src/learn/math/drill/score-bar.jsx';

const nowFn = Date.now;

function mockDates(times) {
  let idx = 0;
  Date.now = vi.fn(() => {
    const time = times[Math.min(idx++, times.length - 1)];
    return time ? time.date + time.dateMockDelta : nowFn();
  });
}

describe('ScoreBar', () => {
  afterAll(() => {
    Date.now = nowFn;
  });

  test('should not show if showScoreBar is false', () => {
    const times = [];

    let component;
    act(() => {
      component = renderer.create(<ScoreBar showScoreBar={false} times={times} />);
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should not show if times is empty', () => {
    const times = [];

    let component;
    act(() => {
      component = renderer.create(<ScoreBar showScoreBar times={times} />);
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 1 column with Gold Badge', () => {
    const times = [
      {
        date: 1506395542848, // 9/25/2017 8:12pm PST
        dateMockDelta: 1000 * 60 * 4,
        timePerQuestion: 1.5,
      },
    ];

    mockDates(times);

    let component;
    act(() => {
      component = renderer.create(<ScoreBar showScoreBar times={times} />);
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 1 column with below Blue Badge', () => {
    const times = [
      {
        date: 1506395542848, // 9/25/2017 8:12pm PST
        dateMockDelta: 1000 * 60 * 4,
        timePerQuestion: 15.2,
      },
    ];

    mockDates(times);

    let component;
    act(() => {
      component = renderer.create(<ScoreBar showScoreBar times={times} />);
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  test('should show 5 columns with mixed Badges', () => {
    const times = [
      {
        date: 1506395542848, // 9/25/2017 8:12pm PST
        dateMockDelta: 1000 * 60 * 4,
        timePerQuestion: 15.2,
      },
      {
        date: 1506395642848, // A bit later
        dateMockDelta: 1000 * 60 * 2,
        timePerQuestion: 10.2,
      },
      {
        date: 1506395742848, // And later
        dateMockDelta: 1000 * 3,
        timePerQuestion: 5.2,
      },
    ];

    mockDates(times);

    let component;
    act(() => {
      component = renderer.create(<ScoreBar showScoreBar times={times} />);
    });

    const finishedBadge = component.toJSON();
    expect(finishedBadge).toMatchSnapshot();
  });

  describe('formatFromNow', () => {
    const base = 1506395542848;

    test('should format seconds as a few seconds ago', () => {
      Date.now = vi.fn(() => base + 1000 * 10);
      expect(formatFromNow(base)).toBe('a few seconds ago');
    });

    test('should format 1 minute as a minute ago', () => {
      Date.now = vi.fn(() => base + 1000 * 60);
      expect(formatFromNow(base)).toBe('a minute ago');
    });

    test('should format multiple minutes', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 15);
      expect(formatFromNow(base)).toBe('15 minutes ago');
    });

    test('should format 1 hour as an hour ago', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60);
      expect(formatFromNow(base)).toBe('an hour ago');
    });

    test('should format multiple hours', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 5);
      expect(formatFromNow(base)).toBe('5 hours ago');
    });

    test('should format 1 day as a day ago', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24);
      expect(formatFromNow(base)).toBe('a day ago');
    });

    test('should format multiple days', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24 * 7);
      expect(formatFromNow(base)).toBe('7 days ago');
    });

    test('should format months', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24 * 35);
      expect(formatFromNow(base)).toBe('a month ago');
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24 * 65);
      expect(formatFromNow(base)).toBe('2 months ago');
    });

    test('should format years', () => {
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24 * 370);
      expect(formatFromNow(base)).toBe('a year ago');
      Date.now = vi.fn(() => base + 1000 * 60 * 60 * 24 * 750);
      expect(formatFromNow(base)).toBe('2 years ago');
    });
  });
});
