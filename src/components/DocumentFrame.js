import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import "./DocumentFrame.css";

function DocumentFrame({ pageBytes, className }) {
  const blob = new Blob([pageBytes], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  function onDocumentLoad(pdf) {
    console.log(pdf);
    console.log(document.querySelector(`.${className} canvas`));
  }
  return (
    <div className="document-frame">
      <Document file={blobUrl} className={className}>
        <Page pageNumber={1} onRenderSuccess={onDocumentLoad} />
      </Document>
    </div>
  );
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string
};

export default DocumentFrame;
