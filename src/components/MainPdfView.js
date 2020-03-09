import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentFrame from "./DocumentFrame";
import { movePageUp, movePageDown, removePage } from "../redux/actions";

import "./MainPdfView.scss";

function MainPdfView(props) {
  return (
    <div className="documents">
      {props.pages.length > 0 ? (
        props.pages.map((page, index) => {
          return (
            <div key={page.id} className="document-container">
              <DocumentFrame
                pageBytes={page.bytes}
                className={`page-${index}`}
              ></DocumentFrame>
              <div className="page-controls">
                <button
                  className="button"
                  onClick={() => props.movePageUp(index)}
                >
                  <i className="fas fa-chevron-up"></i>
                  Move up
                </button>
                <button
                  className="button"
                  onClick={() => props.movePageDown(index)}
                >
                  <i className="fas fa-chevron-down"></i>
                  Move down
                </button>
                <Link to={`/edit/${index}`} className="button">
                  <i className="fas fa-edit"></i>Edit page
                </Link>
                <button
                  className="button is-dark"
                  onClick={() => props.removePage(index)}
                >
                  <i className="fas fa-trash"></i>
                  Remove page
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <h1 className="load-doc-header">Load a document</h1>
      )}
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
