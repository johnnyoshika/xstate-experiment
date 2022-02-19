import { interpret } from 'xstate';
import { createSubredditMachine } from './subredditMachine';

describe('Subreddit machine (live)', () => {
  it('Should load posts of a selected subreddit', done => {
    const machine = createSubredditMachine('reactjs');
    interpret(machine)
      .onTransition(state => {
        // When the state reaches 'selected.loaded', the test has succeeded

        console.log(
          state.value,
          state.context.subreddit,
          state.context.posts?.map(post => post.title).slice(0, 3),
        );
        if (state.matches('loaded')) {
          expect(state.context.posts?.length).toBeGreaterThan(0);
          done();
        }
      })
      .start();
  });
});
