declare module '*' {
    export interface ZXing {
      _malloc(byteLength: number): number;
      HEAPU8: Uint8Array;
      _free(buffer: number): void;
      readBarcodeFromPixmap(
        buffer: number,
        height: number,
        width: number,
        isRGBA: boolean,
        format: string
      ): { error?: string; text?: string };
      readBarcodeFromImage(
        buffer: number,
        length: number,
        isRGBA: boolean,
        format: string
      ): { error?: string; text?: string };
    }
    export default function ZXing(): Promise<ZXing>;
}