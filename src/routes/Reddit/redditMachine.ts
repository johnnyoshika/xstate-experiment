import { assign, createMachine } from 'xstate';

interface RedditContext {
  subreddit: string | null;
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
    subreddit: null,
  },
  states: {
    idle: {},
    selected: {},
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (context, event) => event.name,
      }),
    },
  },
});
