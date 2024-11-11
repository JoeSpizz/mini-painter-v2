import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Painting Simulator</h1>
        <p>Message from backend: {message}</p>
      </header>
    </div>
  );
}

export default App;
