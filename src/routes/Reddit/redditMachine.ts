import type { ActorRefFrom } from 'xstate';
import { assign, createMachine, spawn } from 'xstate';
import { createSubredditMachine } from './subredditMachine';

interface RedditContext {
  subreddits: Record<string, any>;
  subreddit: ActorRefFrom<typeof createSubredditMachine> | null; // I have no idea if I set this `typeof machineFactory` type correctly
}

interface RedditEvents {
  type: 'SELECT';
  name: string;
}

export const redditMachine = createMachine<
  RedditContext,
  RedditEvents
>({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddits: {},
    subreddit: null,
  },
  states: {
    idle: {},
    selected: {},
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign((context, event) => {
        let subreddit = context.subreddits[event.name];
        if (subreddit) return { ...context, subreddit };

        subreddit = spawn(createSubredditMachine(event.name));

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit,
          },
          subreddit,
        };
      }),
    },
  },
});
