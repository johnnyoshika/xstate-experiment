import { interpret } from 'xstate';
import { redditMachine } from './redditMachine';

describe('Reddit machine (live)', () => {
  it('Should load posts of a selected subreddit', done => {
    const redditService = interpret(redditMachine)
      .onTransition(state => {
        // When the state reaches 'selected.loaded', the test has succeeded

        console.log(
          state.value,
          state.context.subreddit,
          state.context.posts?.map(post => post.title).slice(0, 3),
        );
        if (state.matches({ selected: 'loaded' })) {
          expect(state.context.posts?.length).toBeGreaterThan(0);
          done();
        }
      })
      .start();

    redditService.send('SELECT', { name: 'reactjs' });
  });
});
