import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrafficLight from './routes/TrafficLight';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrafficLight />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
