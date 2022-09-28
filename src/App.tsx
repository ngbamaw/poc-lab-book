import React from 'react'
import './App.css'
import useScanner from './hooks/useScanner'
import useWindowDimensions from './hooks/useWindowDimensions';

function App() {
  const { width, height } = useWindowDimensions();
  const { code, start } = useScanner("reader", {
    fps: 60,
    qrbox: { width: width - 24, height: width - 24 },
  });

  const size = { width, /* height */ };

  React.useEffect(() => {
    console.log(code);
  }, [code])
  return (
    <div className="App">
      <div id="reader" style={size}></div>
      <button onClick={() => start()}>Scan</button>
      {code && <p>Book: {code}</p>}
    </div>
  );
}

export default App
