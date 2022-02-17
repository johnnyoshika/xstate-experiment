import { useState } from 'react';
import { createMachine } from 'xstate';

const lightMachine = createMachine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow',
      },
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
    },
    red: {
      on: {
        TIMER: 'green',
      },
    },
  },
});

const App = () => {
  const [state, setState] = useState(lightMachine.initial as string);

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <div>{state}</div>
        <button
          onClick={() =>
            //@ts-ignore
            setState(lightMachine.transition(state, 'TIMER').value)
          }
        >
          CHANGE
        </button>
      </div>
    </div>
  );
};

export default App;
