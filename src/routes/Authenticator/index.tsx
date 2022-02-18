import { useEffect, useMemo, useState } from 'react';
import { createMachine, interpret } from 'xstate';

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
  const [auth, setAuth] = useState(authMachine.initialState);

  const service = useMemo(
    () =>
      interpret(authMachine).onTransition(current =>
        setAuth(current),
      ),
    [setAuth],
  );

  useEffect(() => {
    service.start();

    return () => {
      service.stop();
    };
  }, [service]);

  const logIn = () => {
    service.send({ type: 'LOGIN' });
  };

  const logOut = () => {
    service.send({ type: 'LOGOUT' });
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
        {auth.context.errorMessage && (
          <div style={{ color: 'red' }}>
            {auth.context.errorMessage}
          </div>
        )}
        {auth.value === 'loading' && <div>Loading...</div>}
        {auth.value === 'unauthorized' && (
          <div>
            <button onClick={logIn}>Log In</button>
          </div>
        )}
        {auth.value === 'authorized' && (
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
