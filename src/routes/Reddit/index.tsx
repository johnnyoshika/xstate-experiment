// Tutorial: https://xstate.js.org/docs/tutorials/reddit.html#implementing-the-ui

import { useMachine } from '@xstate/react';
import { redditMachine } from './redditMachine';

const subreddits = ['frontend', 'reactjs', 'vuejs', 'bad_bad_bad'];

const Reddit = () => {
  const [current, send] = useMachine(redditMachine);
  const { subreddit, posts } = current.context;

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
      <section>
        <h1>
          {current.matches('idle') ? 'Select a subreddit' : subreddit}
        </h1>
        {current.matches({ selected: 'loading' }) && (
          <div>Loading...</div>
        )}
        {current.matches({ selected: 'loaded' }) && (
          <ul>
            {posts?.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
        {current.matches({ selected: 'failed' }) && (
          <div>Failed to load posts</div>
        )}
      </section>
    </main>
  );
};

export default Reddit;
