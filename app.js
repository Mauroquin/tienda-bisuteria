import React, { useEffect } from 'react';

function App() {

  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Tienda de Bisutería</h1>
      <p>Revisa la consola 👇</p>
    </div>
  );
}

export default App;
