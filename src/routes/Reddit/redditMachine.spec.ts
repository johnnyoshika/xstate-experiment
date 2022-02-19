import { interpret } from 'xstate';
import { redditMachine } from './redditMachine';

describe('Reddit machine (live)', () => {
  it('Should change to selected', done => {
    const redditService = interpret(redditMachine)
      .onTransition(state => {
        // When the state reaches 'selected', the test has succeeded

        console.log(state.value);
        if (state.matches('selected')) {
          expect(state.context.subreddit).toBeTruthy();
          done();
        }
      })
      .start();

    redditService.send('SELECT', { name: 'reactjs' });
  });
});
