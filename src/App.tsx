import React from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import useScanner from './hooks/useScanner'

function App() {
  const { code, start } = useScanner("reader", {
    fps: 10,
    qrbox: { width: 200, height: 200 },
  });

  React.useEffect(() => {
    console.log(code);
  }, [code])
  return (
    <div className="App">
      <div id="reader" style={{ width: 300 }}></div>
      <button onClick={() => start()}>Scan</button>
      {code && <p>Book: {code.decodedText}</p>}
    </div>
  );
}

export default App
