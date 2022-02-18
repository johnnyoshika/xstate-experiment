// Tutorial: http://realfiction.net/2019/01/30/xstate-a-typescript-state-machine-with-a-lot-of-features
// Source code: https://github.com/flq/test-of-xstate

import { useEffect, useMemo, useState } from 'react';
import {
  actions,
  EventObject,
  interpret,
  Machine,
  MachineConfig,
  StateValue,
} from 'xstate';
import { Play, Spool, Stop } from './controls';

import './index.css';

type EventId = 'PLAY' | 'STOP' | 'FORWARD' | 'REWIND';
interface TapePlayerEvent extends EventObject {
  type: EventId;
}

interface TapePlayerStateSchema {
  states: {
    stopped: {};
    playing: {};
    forwarding: {};
    rewinding: {};
  };
}

type AvailableStates = keyof TapePlayerStateSchema['states'];

interface TapePlayerContext {
  pos: number;
}

const playingEffect = actions.assign<
  TapePlayerContext,
  TapePlayerEvent
>(ctx => ({
  pos: ctx.pos + 1,
}));

const forwardingEffect = actions.assign<
  TapePlayerContext,
  TapePlayerEvent
>(ctx => ({
  pos: ctx.pos + (10 - (ctx.pos % 10)),
}));

const rewindingEffect = actions.assign<
  TapePlayerContext,
  TapePlayerEvent
>(ctx => ({
  pos: ctx.pos - (ctx.pos % 10 || 10),
}));

const machineBuilder = (): [
  MachineConfig<
    TapePlayerContext,
    TapePlayerStateSchema,
    TapePlayerEvent
  >,
  any,
] => [
  {
    id: 'tape player',
    initial: 'stopped',
    context: {
      pos: 0,
    },
    states: {
      rewinding: {
        entry: ['rewindingEffect'],
        after: {
          500: [
            { target: 'rewinding', cond: ctx => ctx.pos > 0 },
            { target: 'stopped' },
          ],
        },
        on: { STOP: 'stopped' },
      },
      stopped: {
        on: {
          PLAY: { target: 'playing' },
          FORWARD: 'forwarding',
          REWIND: 'rewinding',
        },
      },
      playing: {
        entry: ['playingEffect'],
        after: {
          500: [
            { target: 'playing', cond: ctx => ctx.pos < 100 },
            { target: 'stopped' },
          ],
        },
        on: {
          FORWARD: 'forwarding',
          STOP: 'stopped',
        },
      },
      forwarding: {
        entry: ['forwardingEffect'],
        after: {
          500: [
            { target: 'forwarding', cond: ctx => ctx.pos < 100 },
            { target: 'stopped' },
          ],
        },
        on: {
          PLAY: 'playing',
          STOP: 'stopped',
        },
      },
    },
  },
  {
    actions: {
      playingEffect,
      forwardingEffect,
      rewindingEffect,
    },
  },
];

const [states, options] = machineBuilder();
const machine = Machine<TapePlayerContext, any, TapePlayerEvent>(
  states,
  options,
);

const TapePlayer = () => {
  const [state, setState] = useState<{
    currentState: StateValue | null;
    tapePosition: number | null;
    nextPossibleStates: string[];
  }>({
    currentState: null,
    tapePosition: null,
    nextPossibleStates: [],
  });

  const service = useMemo(
    () =>
      interpret(machine).onTransition(newState => {
        setState({
          currentState: newState.value,
          tapePosition: newState.context.pos,
          nextPossibleStates: newState.nextEvents,
        });
      }),
    [setState],
  );

  useEffect(() => {
    service.start();

    return () => {
      service.stop();
    };
  }, [service]);

  const mayNotSend = (event: EventId) =>
    state.nextPossibleStates.findIndex(v => v === event) === -1;

  const isCurrentState = (checkState: AvailableStates) =>
    checkState === state.currentState;

  const backwardClick = () => {
    service.send({ type: 'REWIND' });
  };

  const forwardClick = () => {
    service.send({ type: 'FORWARD' });
  };

  const playClick = () => {
    service.send({ type: 'PLAY' });
  };

  const stopClick = () => {
    service.send({ type: 'STOP' });
  };

  return (
    <div className="app">
      <div className="controls">
        <Spool
          role="backward"
          disabled={mayNotSend('REWIND')}
          active={isCurrentState('rewinding')}
          onClick={backwardClick}
        />
        <Stop
          disabled={mayNotSend('STOP')}
          active={isCurrentState('stopped')}
          onClick={stopClick}
        />
        <Play
          disabled={mayNotSend('PLAY')}
          active={isCurrentState('playing')}
          onClick={playClick}
        />
        <Spool
          role="forward"
          disabled={mayNotSend('FORWARD')}
          active={isCurrentState('forwarding')}
          onClick={forwardClick}
        />
      </div>
      <div className="state">{state.currentState}</div>
      <div className="tape-position">{state.tapePosition}</div>
    </div>
  );
};

export default TapePlayer;
