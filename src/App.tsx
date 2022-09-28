import React from 'react'
import './App.css'
import useScanner from './hooks/useScanner'
import useWindowDimensions from './hooks/useWindowDimensions';

function App() {
  const { width, height } = useWindowDimensions();
  const { code, start, scanFile } = useScanner("reader");

  const size = { width: 500, /* height */ };

  const onChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      scanFile(file);
    }
  };
  
  React.useEffect(() => {
    console.log(code);
  }, [code])
  return (
    <div className="App">
      <div id="reader" style={size}></div>
      <button onClick={() => start()}>Scan</button>
      <input type="file" accept="image/*" capture="environment" onChange={onChange}/>
      {code && <p>Book: {code}</p>}
    </div>
  );
}

export default App
