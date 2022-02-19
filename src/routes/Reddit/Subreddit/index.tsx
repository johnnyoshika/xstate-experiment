// Tutorial: https://xstate.js.org/docs/tutorials/reddit.html#implementing-the-ui

import { useMachine } from '@xstate/react';
import { useMemo } from 'react';
import { createSubredditMachine } from './subredditMachine';

const Subreddit = ({ name }: { name: string }) => {
  const machine = useMemo(() => createSubredditMachine(name), [name]);

  const [current] = useMachine(machine);
  const { subreddit, posts } = current.context;

  return (
    <section>
      <h1>{subreddit}</h1>
      {current.matches('loading') && <div>Loading...</div>}
      {current.matches('loaded') && (
        <ul>
          {posts?.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
      {current.matches('failed') && <div>Failed to load posts</div>}
    </section>
  );
};

export default Subreddit;
