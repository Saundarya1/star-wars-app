import './App.scss';
import PeopleList1 from './components/PeopleList1';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div className="App">
      <div className='device-shape'>
        <div className='device-shape-screen'><p>Users data:</p></div>
        <PeopleList1 />
      </div>
    </div>
  );

}

export default App;