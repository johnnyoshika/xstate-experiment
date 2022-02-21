import { Link, Route, Routes } from 'react-router-dom';
import Task1 from './Task1';
import Task2 from './Task2';
import Task3 from './Task3';
import Task4 from './Task4';

const SevenGUIs = () => {
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Link to="">Task 1</Link> <Link to="task2">Task 2</Link>{' '}
        <Link to="task3">Task 3</Link> <Link to="task4">Task 4</Link>
      </div>
      <Routes>
        <Route index element={<Task1 />} />
        <Route path="task2" element={<Task2 />} />
        <Route path="task3" element={<Task3 />} />
        <Route path="task4" element={<Task4 />} />
      </Routes>
    </div>
  );
};

export default SevenGUIs;
