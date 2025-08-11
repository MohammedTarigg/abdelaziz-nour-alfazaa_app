declare module 'react-native-print' {
  interface PrintOptions {
    html?: string;
    filePath?: string;
    printer?: string;
    showUI?: boolean;
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  }

  interface Print {
    print(options: PrintOptions): Promise<void>;
    selectPrinter(): Promise<string | null>;
    getAvailablePrinters(): Promise<string[]>;
  }

  const Print: Print;
  export default Print;
}
