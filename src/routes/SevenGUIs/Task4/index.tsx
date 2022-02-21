import { assign, createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

interface TimerContext {
  elapsed: number;
  duration: number;
  interval: number;
}

type TimerEvent =
  | {
      type: 'TICK';
    }
  | {
      type: 'DURATION.UPDATE';
      value: number;
    }
  | { type: 'RESET' };

const timerMachine = createMachine<TimerContext, TimerEvent>({
  initial: 'running',
  context: {
    elapsed: 0,
    duration: 5,
    interval: 0.1,
  },
  states: {
    running: {
      invoke: {
        src: context => cb => {
          const interval = setInterval(() => {
            cb('TICK');
          }, 1000 * context.interval);

          return () => {
            clearInterval(interval);
          };
        },
      },
      always: {
        target: 'paused',
        cond: context => context.elapsed >= context.duration,
      },
      on: {
        TICK: {
          actions: assign({
            elapsed: context =>
              +(context.elapsed + context.interval).toFixed(2),
          }),
        },
      },
    },
    paused: {
      always: {
        target: 'running',
        cond: context => context.elapsed < context.duration,
      },
    },
  },
  //@ts-ignore (Don't understand why there's a type complaint here)
  on: {
    'DURATION.UPDATE': {
      actions: assign({ duration: (_, event) => event.value }),
    },
    RESET: {
      actions: assign({ elapsed: 0 }),
    },
  },
});

const Task4 = () => {
  const [current, send] = useMachine(timerMachine);

  const { elapsed, duration } = current.context;

  return (
    <section>
      <label>
        <span>Elapsed time:</span>
        <output>
          {elapsed.toFixed(1)}s / {duration.toFixed(1)}s
        </output>
        <progress max={duration} value={elapsed} />
      </label>
      <label>
        <span>Duration:</span>
        <input
          type="range"
          min={0}
          max={30}
          value={duration}
          onChange={e => {
            send('DURATION.UPDATE', { value: +e.target.value });
          }}
        />
      </label>
      <button onClick={_ => send('RESET')}>Reset</button>
    </section>
  );
};

export default Task4;
