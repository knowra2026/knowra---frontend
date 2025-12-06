import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useGesture } from "@use-gesture/react";
import PropTypes from "prop-types";
// Update the import paths for CSS files
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ file }) {
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Pinch-to-zoom gesture for mobile
  const bind = useGesture({
    onPinch: ({ offset: [d] }) => {
      setScale(s => Math.max(0.5, Math.min(3, s * d)));
    }
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div
      {...bind()}
      style={{
        overflow: "auto",
        touchAction: "none",
        width: "100%",
        height: "80vh",
        background: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div style={{ display: "flex", gap: "8px", margin: "8px 0", alignItems: "center" }}>
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
        <span style={{ minWidth: 40, textAlign: "center" }}>{(scale * 100).toFixed(0)}%</span>
        <button onClick={() => setScale(s => Math.min(3, s + 0.1))}>+</button>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
        <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>&lt;</button>
        <span>Page {pageNumber} / {numPages || '?'}</span>
        <button onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))} disabled={pageNumber >= numPages}>&gt;</button>
      </div>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={<div>Loading PDF...</div>}>
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </div>
  );
}

PdfViewer.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File)
  ]).isRequired
};
