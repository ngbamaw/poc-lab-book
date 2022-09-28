import React from 'react';
import BarcodeScanner from '../zxing/BarcodeScanner';


const defaultConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

const useScanner = (elementId: string) => {
  const [code, setCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const scanner = React.useRef<BarcodeScanner | null>(null);

  const onScanSuccess = React.useCallback((decodedText?: string) => {
    // handle the scanned code as you like, for example:
    if(decodedText) {
      setCode(decodedText);
    }
  },[]);

  const onScanFailure = React.useCallback((qrError: Error) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.error(`Code scan error = ${qrError}`);
    setError(qrError);
  }, []);
  React.useEffect(() => {
    scanner.current = new BarcodeScanner(elementId, onScanSuccess, onScanFailure);
  }, [elementId]);

  const start = React.useCallback(() => {
    scanner.current?.render();
  }, [elementId]);

  const scanFile = (file: File) => {
    scanner.current?.scanFile(file).then((decodedText) => setCode(decodedText)).catch((err) => setError(new Error(err)));
  };
  
  return { code, error, start, scanFile };
};

export default useScanner;