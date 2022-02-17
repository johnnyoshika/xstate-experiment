import { useState } from 'react';
import { createMachine } from 'xstate';

const machine = createMachine({
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

const TrafficLight = () => {
  const [state, setState] = useState(machine.initial as string);

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
            setState(machine.transition(state, 'TIMER').value)
          }
        >
          CHANGE
        </button>
      </div>
    </div>
  );
};

export default TrafficLight;
