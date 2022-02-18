import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import TrafficLight from './routes/TrafficLight';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <div style={{ margin: '16px', textAlign: 'center' }}>
          <Link to="/">Traffic Light</Link>
        </div>
        <Routes>
          <Route path="/" element={<TrafficLight />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
