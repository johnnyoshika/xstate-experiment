import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Authenticator from './routes/Authenticator';
import Reddit from './routes/Reddit';
import TapePlayer from './routes/TapePlayer';
import TrafficLight from './routes/TrafficLight';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <div style={{ margin: '16px', textAlign: 'center' }}>
          <Link to="/">Traffic Light</Link> |{' '}
          <Link to="/tapeplayer">Tape Player</Link> |{' '}
          <Link to="/authenticator">Authenticator</Link> |{' '}
          <Link to="/reddit">Reddit</Link>
        </div>
        <Routes>
          <Route path="/" element={<TrafficLight />} />
          <Route path="/tapeplayer" element={<TapePlayer />} />
          <Route path="/authenticator" element={<Authenticator />} />
          <Route path="/reddit" element={<Reddit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
