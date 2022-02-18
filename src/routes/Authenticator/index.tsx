import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

// source: https://www.skcript.com/svr/finite-state-machines-in-react-js-using-xstate/

const authMachine = createMachine(
  {
    id: 'authentication',
    initial: 'unauthorized',
    context: {
      errorMessage: null,
    } as { errorMessage: string | null },
    states: {
      unauthorized: {
        on: {
          LOGIN: 'loading',
        },
      },
      loading: {
        after: {
          1000: [
            {
              target: 'authorized',
              actions: ['onSuccess'],
              cond: () => Math.random() > 0.5,
            },
            { target: 'unauthorized', actions: ['onError'] },
          ],
        },
      },
      authorized: {
        on: {
          LOGOUT: 'unauthorized',
        },
      },
    },
  },
  {
    actions: {
      onSuccess: context => {
        context.errorMessage = null;
      },
      onError: (context, event) => {
        context.errorMessage = event.errorMessage ?? 'Unknown error';
      },
    },
  },
);

const Authenticator = () => {
  const [current, send] = useMachine(authMachine);

  const logIn = () => {
    send({ type: 'LOGIN' });
  };

  const logOut = () => {
    send({ type: 'LOGOUT' });
  };

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: 'calc(100vh - 100px)',
      }}
    >
      <div>
        {current.context.errorMessage && (
          <div style={{ color: 'red' }}>
            {current.context.errorMessage}
          </div>
        )}
        {current.matches('loading') && <div>Loading...</div>}
        {current.matches('unauthorized') && (
          <div>
            <button onClick={logIn}>Log In</button>
          </div>
        )}
        {current.matches('authorized') && (
          <div>
            Hi Sammy!
            <button onClick={logOut}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authenticator;
