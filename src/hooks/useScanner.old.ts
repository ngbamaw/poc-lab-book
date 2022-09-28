import React from 'react';
import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";
import { Html5QrcodeResult, Html5QrcodeScanType, Html5QrcodeSupportedFormats, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode/esm/core';
import { Html5QrcodeCameraScanConfig } from 'html5-qrcode/esm/html5-qrcode';

const defaultConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
const useScanner = (elementId: string, config: Html5QrcodeCameraScanConfig = defaultConfig) => {
  const [code, setCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const html5QrCode = React.useRef<Html5Qrcode | null>(null);

  React.useEffect(() => {
    html5QrCode.current = new Html5Qrcode(elementId);
  });

  const onScanSuccess: QrcodeSuccessCallback = React.useCallback((decodedText) => {
    // handle the scanned code as you like, for example:
    setCode(decodedText);
  },[]);

  const onScanFailure: QrcodeErrorCallback = React.useCallback((qrError) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${qrError}`);
    setError(new Error(qrError));
  }, []);

  const start = React.useCallback(() => {

    // If you want to prefer back camera
    html5QrCode.current?.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    );
    /* 
  const html5QrcodeScanner = new Html5QrcodeScanner(
    elementId,
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE,
      ],
    },
    false
  );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure); */
  }, [elementId]);

  const scanFile = (file: File) => {
    html5QrCode.current?.scanFile(file).then((decodedText) => setCode(decodedText)).catch((err) => setError(new Error(err)));
  };
  
  return { code, error, start, scanFile };
};

export default useScanner;