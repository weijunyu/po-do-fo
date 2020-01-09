import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import "./DocumentFrame.css";

function DocumentFrame({ pageBytes, title }) {
  const blob = new Blob([pageBytes], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const pageNumber = 1;
  return (
    <div className="document-frame">
      <Document file={blobUrl}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string
};

export default DocumentFrame;
