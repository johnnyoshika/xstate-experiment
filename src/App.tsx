import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import TapePlayer from './routes/TapePlayer';
import TrafficLight from './routes/TrafficLight';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <div style={{ margin: '16px', textAlign: 'center' }}>
          <Link to="/">Traffic Light</Link> |{' '}
          <Link to="/tapeplayer">Tape Player</Link>
        </div>
        <Routes>
          <Route path="/" element={<TrafficLight />} />
          <Route path="/tapeplayer" element={<TapePlayer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
