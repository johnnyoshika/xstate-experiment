import { assign, createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import { FlightInput } from './FlightInput';

interface FlightContext {
  startDate?: string;
  returnDate?: string;
  trip: 'oneWay' | 'roundTrip';
}

type FlightEvent =
  | { type: 'SET_TRIP'; value: 'oneWay' | 'roundTrip' }
  | { type: 'startDate.UPDATE'; value: string }
  | { type: 'returnDate.UPDATE'; value: string }
  | { type: 'SUBMIT' };

const flightMachine = createMachine<FlightContext, FlightEvent>({
  id: 'flight',
  initial: 'editing',
  context: {
    startDate: undefined,
    returnDate: undefined,
    trip: 'oneWay',
  },
  states: {
    editing: {
      on: {
        'startDate.UPDATE': {
          actions: assign({ startDate: (_, event) => event.value }),
        },
        'returnDate.UPDATE': {
          actions: assign({ returnDate: (_, event) => event.value }),
          cond: context => context.trip === 'roundTrip',
        },
        SET_TRIP: {
          actions: assign({ trip: (_, event) => event.value }),
          cond: (_, event) =>
            event.value === 'oneWay' || event.value === 'roundTrip',
        },
        SUBMIT: {
          target: 'submitted',
          cond: context => {
            if (context.trip === 'oneWay') return !!context.startDate;

            return (
              !!context.startDate &&
              !!context.returnDate &&
              context.returnDate > context.startDate
            );
          },
        },
      },
    },
    submitted: {
      type: 'final',
    },
  },
});

const Task3 = () => {
  const [current, send] = useMachine(flightMachine);

  const { startDate, returnDate, trip } = current.context;

  const canSubmit = flightMachine.transition(
    current,
    'SUBMIT',
  ).changed;

  return (
    <section style={{ margin: '24px auto', width: '600px' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <select
          onChange={e =>
            send({
              type: 'SET_TRIP',
              value: e.target.value as 'oneWay' | 'roundTrip',
            })
          }
          value={trip}
        >
          <option value="oneWay">One Way</option>
          <option value="roundTrip">Round Trip</option>
        </select>
        <FlightInput
          value={startDate}
          onChange={(value: string) =>
            send({ type: 'startDate.UPDATE', value })
          }
          error={!startDate}
          label="Start Date"
        />
        <FlightInput
          value={returnDate}
          onChange={(value: string) =>
            send({ type: 'returnDate.UPDATE', value })
          }
          error={
            !returnDate || (startDate && returnDate <= startDate)
          }
          disabled={trip === 'oneWay'}
          label="Return Date"
        />
        <button
          type="button"
          onClick={() => send('SUBMIT')}
          disabled={!canSubmit}
        >
          {current.matches('editing') && 'Submit'}
          {current.matches('submitted') && 'Success!'}
        </button>
      </form>
    </section>
  );
};

export default Task3;
