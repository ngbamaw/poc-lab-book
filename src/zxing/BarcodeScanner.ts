import Camera from "./Camera.js";
/// <reference path="./type.d.ts" />
import ZXingModule, { ZXing } from "./zxing_reader.js";

let zxing: ZXing | null = null;
ZXingModule().then(function(value) {
    zxing = value;
});

type SuccessHandler = (text?: string) => void
type ErrorHandler = (error: Error) => void

class BarcodeScanner {
    private successHandler: SuccessHandler;
    private errorHandler: ErrorHandler;
    private camera: Camera;

    constructor(element: HTMLElement | string, successHandler: SuccessHandler, errorHandler: ErrorHandler) {
        this.successHandler = successHandler;
        this.errorHandler = errorHandler;
        this.camera = new Camera(element);
    }

    scanBarcode(sourceBuffer: Uint8ClampedArray, height: number, width: number, format: string) {
        if (zxing != null) {
            const buffer = zxing._malloc(sourceBuffer.byteLength);
            zxing.HEAPU8.set(sourceBuffer, buffer);
            const result = zxing.readBarcodeFromPixmap(buffer, height, width, true, format);
            zxing._free(buffer);
            return result;
        } else {
            throw Error("ZXing not yet initialized");
        }
    }

    scanFile(file: File): Promise<string | null> {
      if (zxing === null) {
        throw Error("ZXing not yet initialized");
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function(evt) {
          console.log(zxing);
          const fileData = new Uint8Array(evt.target!.result as ArrayBufferLike);
          const buffer = zxing!._malloc(fileData.length);
          zxing!.HEAPU8.set(fileData, buffer);
          var result = zxing!.readBarcodeFromImage(buffer, fileData.length, true, '');
          zxing!._free(buffer);
          console.log(result);
          
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result.text || null); 
          }
        }

        reader.readAsArrayBuffer(file);
      })
    }

    getBufferFromCanvas(canvasElement: HTMLCanvasElement) {
        const imageData = canvasElement.getContext("2d")!.getImageData(0, 0, canvasElement.width, canvasElement.height);
        return imageData.data;
    }

 render() {
   // const canvas = canvasElement.getContext("2d");
   // const loadingMessage = document.getElementById("loadingMessage");
   // const outputContainer = document.getElementById("output");
   // const outputMessage = document.getElementById("outputMessage");
   // const outputData = document.getElementById("outputData");
   // const cameraSelect = document.getElementById("camera_select");

   // function drawLine(begin, end, color) {
   //   canvas.beginPath();
   //   canvas.moveTo(begin.x, begin.y);
   //   canvas.lineTo(end.x, end.y);
   //   canvas.lineWidth = 4;
   //   canvas.strokeStyle = color;
   //   canvas.stroke();
   // }

   const onCallback = (canvasElement: HTMLCanvasElement) => {

      const buffer = this.getBufferFromCanvas(canvasElement);
      const code = this.scanBarcode(
        buffer,
        canvasElement.width,
        canvasElement.height,
        ""
      );
      if (code.error) {
        this.errorHandler(new Error(code.error));
      } else {
        this.successHandler(code.text);
      }
   }
   
   this.camera.startCamera(onCallback);
   
 }
    
}

export default BarcodeScanner;