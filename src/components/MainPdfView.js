import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentFrame from "./DocumentFrame";
import { movePageUp, movePageDown, removePage } from "../redux/actions";

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
                    <i className="fas fa-chevron-up"></i>
                    <br />
                    Move up
                  </button>
                  <button
                    className="btn"
                    onClick={() => props.movePageDown(index)}
                  >
                    Move down
                    <br />
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <Link to={`/edit/${index}`} className="btn">Edit</Link>
                  <button
                    className="btn secondary"
                    onClick={() => props.removePage(index)}
                  >
                    <i className="fas fa-trash"></i>
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
  movePageDown,
  removePage
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPdfView);
