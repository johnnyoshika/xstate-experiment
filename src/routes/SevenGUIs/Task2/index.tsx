import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';

const temperatureMachine = createMachine<
  {
    C?: string | number;
    F?: string | number;
  },
  | {
      type: 'CELSIUS';
      value: string;
    }
  | {
      type: 'FAHRENHEIT';
      value: string;
    }
>({
  initial: 'active',
  context: { C: undefined, F: undefined },
  states: {
    active: {
      on: {
        CELSIUS: {
          actions: assign({
            C: (_, event) => event.value,
            F: (_, event) =>
              event.value.length
                ? (+event.value * (9 / 5) + 32).toString()
                : '',
          }),
        },
        FAHRENHEIT: {
          actions: assign({
            C: (_, event) =>
              event.value.length
                ? ((+event.value - 32) * (5 / 9)).toString()
                : '',
            F: (_, event) => event.value,
          }),
        },
      },
    },
  },
});

const Task2 = () => {
  const [current, send] = useMachine(temperatureMachine);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Temperature</h1>
      <p>
        Celsius:{' '}
        <input
          type="number"
          value={current.context.C ?? ''}
          onChange={e => send('CELSIUS', { value: e.target.value })}
        />
      </p>
      <p>
        Fahrenheit:{' '}
        <input
          type="number"
          value={current.context.F ?? ''}
          onChange={e =>
            send('FAHRENHEIT', { value: e.target.value })
          }
        />
      </p>
    </div>
  );
};

export default Task2;
