import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Gepland from './pages/Gepland';
import Medewerkers from './pages/Medewerkers';
import HuidigeMeeting from './pages/HuidigeMeeting';
import { clearAllStorage } from './utils/storage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Onze vergaderingen</h1>
          <nav>
            <ul>
              <li><Link to="/gepland">Gepland</Link></li>
              <li><Link to="/medewerkers">Medewerkers</Link></li>
              <li><Link to="/huidige-meeting">Huidige meeting</Link></li>
            </ul>
          </nav>
          <button className="reset-button" onClick={clearAllStorage}>
            Reset App Data
          </button>
        </header>
        <Routes>
          <Route path="/gepland" element={<Gepland />} />
          <Route path="/medewerkers" element={<Medewerkers />} />
          <Route path="/huidige-meeting" element={<HuidigeMeeting />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
