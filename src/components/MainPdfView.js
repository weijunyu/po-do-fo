import React from "react";
import { connect } from "react-redux";

import "./MainPdfView.css";

function MainPdfView(props) {
  return (
    <div className="documents">
      {props.pages.length > 0
        ? props.pages.map((page, index) => {
            const blob = new Blob([page], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            return (
              <div key={index} className="document-container">
                {/* TODO: set iframe height after it's loaded using onload */}
                <iframe
                  key={index}
                  src={blobUrl}
                  title={`page-${index}`}
                  className="document-frame"
                ></iframe>
              </div>
            );
          })
        : "Load a document"}
    </div>
  );
}

function mapStateToProps(state) {
  return { pages: state.pages };
}

export default connect(mapStateToProps)(MainPdfView);
