import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ProfessionalsList from './pages/ProfessionalsList';

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" exact element={<ProfessionalsList />} />
          <Route path="/:tag" exact element={<ProfessionalsList />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
