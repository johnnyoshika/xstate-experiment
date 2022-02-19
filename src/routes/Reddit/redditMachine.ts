import { assign, createMachine } from 'xstate';

interface RedditPost {
  id: string;
  author: string;
  title: string;
  permalink: string;
}

interface RedditContext {
  subreddit: string | null;
  posts: RedditPost[] | null;
}

interface RedditEvents {
  type: 'SELECT';
  name: string;
}

const invokeFetchSubreddit = (context: RedditContext) => {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json =>
      json.data.children.map(
        (child: { kind: string; data: any }) => child.data,
      ),
    );
};

export const redditMachine = createMachine<
  RedditContext,
  RedditEvents
>({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
    posts: null,
  },
  states: {
    idle: {},
    selected: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'fetch-subreddit',
            src: invokeFetchSubreddit,
            onDone: {
              target: 'loaded',
              actions: assign({
                posts: (context, event) => event.data,
              }),
            },
            onError: 'failed',
          },
        },
        loaded: {},
        failed: {},
      },
    },
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
