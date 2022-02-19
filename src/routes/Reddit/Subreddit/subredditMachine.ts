import { assign, createMachine } from 'xstate';

interface SubredditPost {
  id: string;
  author: string;
  title: string;
  permalink: string;
}

interface SubredditContext {
  subreddit: string;
  posts: SubredditPost[] | null;
}

const invokeFetchSubreddit = (context: SubredditContext) => {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json =>
      json.data.children.map(
        (child: { kind: string; data: any }) => child.data,
      ),
    );
};

export const createSubredditMachine = (subreddit: string) =>
  createMachine<SubredditContext>({
    id: 'reddit',
    initial: 'loading',
    context: {
      subreddit,
      posts: null,
    },
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
  });
