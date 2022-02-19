// Tutorial: https://xstate.js.org/docs/tutorials/reddit.html#implementing-the-ui

import { useMachine } from '@xstate/react';
import { redditMachine } from './redditMachine';
import Subreddit from './Subreddit';

const subreddits = ['frontend', 'reactjs', 'vuejs', 'bad_bad_bad'];

const Reddit = () => {
  const [current, send] = useMachine(redditMachine);
  const { subreddit } = current.context;

  return (
    <main
      style={{
        margin: '24px auto',
        width: '600px',
      }}
    >
      <header>
        <select
          style={{ width: '100%' }}
          onChange={e => {
            if (!e.target.value) return;
            send('SELECT', { name: e.target.value });
          }}
        >
          <option></option>
          {subreddits.map(subreddit => (
            <option key={subreddit}>{subreddit}</option>
          ))}
        </select>
      </header>
      {subreddit && <Subreddit actor={subreddit} />}
    </main>
  );
};

export default Reddit;
