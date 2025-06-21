declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      windowWidth?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string | string[];
      orientation?: string;
    };
  }

  interface Html2Pdf {
    set: (opt: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement | string) => Html2Pdf;
    outputPdf: () => Html2Pdf;
    save: () => void;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}
