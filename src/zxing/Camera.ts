class Camera {
  private currentStream: MediaStream | null;
  private canvasElement: HTMLCanvasElement;
  private cameraStarted = false;
  private container: HTMLElement;
  private video: HTMLVideoElement;

  constructor(element: HTMLElement | string) {
    this.video = document.createElement("video");
    this.canvasElement = document.createElement("canvas");
    this.currentStream = null;
    if (typeof element === "string") {
      if (document.getElementById(element)) {
        this.container = document.getElementById(element) as HTMLElement;
      } else {
        throw new Error("Element not found");
      }
    } else {
      this.container = element;
    }
  }

  stopCurrentCamera = () => {
    if (this.currentStream != null) {
      this.currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  tick(onCallback: (canvasElement: HTMLCanvasElement) => void) {
    const { video, canvasElement } = this;
    if (this.video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;
      const canvas = canvasElement.getContext("2d");

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas!.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      // const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);

      onCallback(canvasElement);
    }
    requestAnimationFrame(() => {
      this.tick(onCallback);
    });
  }
  startCamera(
    onCallback: (canvas: HTMLCanvasElement) => void,
    cameraFacing?: string
  ) {
    this.container.append(this.canvasElement);
    this.canvasElement.width = this.container.clientWidth;
    this.canvasElement.height = this.container.clientHeight;
    this.stopCurrentCamera();
    const facingMode = cameraFacing ? { exact: cameraFacing } : "environment";
    window.navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        this.currentStream = stream;
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        this.video.play();
        if (!this.cameraStarted) {
          this.cameraStarted = true;
          requestAnimationFrame(() => {
            this.tick(onCallback);
          });
        }
      });
  }
}

export default Camera;