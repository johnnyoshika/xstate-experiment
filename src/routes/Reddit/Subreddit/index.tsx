// Tutorial: https://xstate.js.org/docs/tutorials/reddit.html#implementing-the-ui

import type { ActorRefFrom } from 'xstate';
import { useActor } from '@xstate/react';
import { createSubredditMachine } from '../subredditMachine';

const Subreddit = ({
  actor,
}: {
  actor: ActorRefFrom<typeof createSubredditMachine>;
}) => {
  const [current] = useActor(actor);
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
