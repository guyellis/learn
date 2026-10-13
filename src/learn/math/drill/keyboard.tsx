import { Backspace, KeyboardReturn } from '@mui/icons-material';
import FloatingActionButton from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

const normalButtonStyle: React.CSSProperties = {
  fontSize: '2em',
  margin: '5px',
};

const largeButtonStyle: React.CSSProperties = {
  fontSize: '2em',
  height: '80px',
  margin: '5px',
  width: '80px',
};

let buttonStyle: React.CSSProperties = {};

export interface KeyboardProps {
  keyPress: (key: number | string) => void;
  largeKeyboard: boolean;
  onscreenKeyboard: boolean;
}

// eslint-disable-next-line react/prefer-stateless-function
class Keyboard extends React.Component<KeyboardProps> {
  click: Record<string, () => void>;

  constructor(props: KeyboardProps) {
    super(props);
    const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', 'enter', 'nothing'];
    this.click = buttons.reduce<Record<string, () => void>>((acc, item) => {
      acc[item] = this.onClick.bind(this, item);
      return acc;
    }, {});

    if (props.largeKeyboard) {
      buttonStyle = { ...largeButtonStyle };
    } else {
      buttonStyle = { ...normalButtonStyle };
    }
  }

  onClick(value: number | string) {
    if (value === 'nothing') {
      return;
    }
    const { keyPress } = this.props;
    keyPress(value);
  }

  render() {
    const { onscreenKeyboard } = this.props;

    if (!onscreenKeyboard) {
      return null;
    }

    type LayoutItem = [React.ReactNode, string, number | string, string];
    type LayoutRow = [string, ...LayoutItem[]];

    const layout: LayoutRow[] = [
      [
        '1', // key
        ['1', 'One', 1, '1'],
        ['2', 'Two', 2, '2'],
        ['3', 'Three', 3, '3'],
        [<Backspace key="backspace" />, 'Backspace', 'back', '4'],
      ],
      [
        '2', // key
        ['4', 'Four', 4, '5'],
        ['5', 'Five', 5, '6'],
        ['6', 'Six', 6, '7'],
        [' ', ' ', 'Nothing1', '8'],
      ],
      [
        '3', // key
        ['7', 'Seven', 7, '9'],
        ['8', 'Eight', 8, '10'],
        ['9', 'Nine', 9, '11'],
        [' ', ' ', 'Nothing2', '12'],
      ],
      [
        '4', // key
        [' ', ' ', 'Nothing3', '13'],
        ['0', 'Zero', 0, '14'],
        [' ', ' ', 'Nothing4', '15'],
        [<KeyboardReturn key="return" />, 'Enter', 'enter', '16'],
      ],
    ];

    return (
      <div>
        {layout.map((lay) => (
          <div key={lay[0]}>
            {(lay.slice(1) as LayoutItem[]).map((item) => {
              const [content, title, click, key] = item;
              return (
                <Tooltip key={key} title={title}>
                  <FloatingActionButton onClick={() => this.onClick(click)} style={buttonStyle}>
                    {content}
                  </FloatingActionButton>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

export default Keyboard;
