import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';

const counterMachine = createMachine<{ count: number }>({
  initial: 'active',
  context: { count: 0 },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: ctx => ctx.count + 1 }),
        },
      },
    },
  },
});

const Task1 = () => {
  const [current, send] = useMachine(counterMachine);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Counter</h1>
      <p>{current.context.count}</p>
      <div>
        <button onClick={() => send('INCREMENT')}>Increment</button>
      </div>
    </div>
  );
};

export default Task1;
