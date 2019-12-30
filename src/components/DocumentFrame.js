import React from "react";
import PropTypes from "prop-types";
import "./DocumentFrame.css";

function DocumentFrame({ pageBytes, title }) {
  const blob = new Blob([pageBytes], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  // Responsive iframe: https://benmarshall.me/responsive-iframes/
  return (
    <div className="iframe-container">
      <iframe
        src={`${blobUrl}#view=fit&toolbar=0&navpanes=0`}
        title={title}
      ></iframe>
    </div>
  );
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string
};

export default DocumentFrame;
