import React from "react";
import { connect } from "react-redux";
import DocumentFrame from "./DocumentFrame";
import { movePageUp, movePageDown } from "../redux/actions";

import "./MainPdfView.css";

function MainPdfView(props) {
  return (
    <div className="documents">
      {props.pages.length > 0
        ? props.pages.map((page, index) => {
            return (
              <div key={index} className="document-container">
                <DocumentFrame
                  pageBytes={page}
                  title={`page-${index}`}
                ></DocumentFrame>
                <div className="page-controls">
                  <button
                    className="btn"
                    onClick={() => props.movePageUp(index)}
                  >
                    Move up
                  </button>
                  <button
                    className="btn"
                    onClick={() => props.movePageDown(index)}
                  >
                    Move down
                  </button>
                </div>
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

const mapDispatchToProps = {
  movePageUp,
  movePageDown
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPdfView);
