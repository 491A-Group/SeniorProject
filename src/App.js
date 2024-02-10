import './App.css';
import React from 'react';
import { useState } from 'react';

import TestPage from './pages/TestPage';


function App() {

  const [activePage, setActivePage] = useState(null);
  

  return (
    <div class="app">
      {activePage ? activePage : <TestPage setAppPage={setActivePage} />}
      <p>Testing</p>
    </div>
  );
  
}

export default App;
