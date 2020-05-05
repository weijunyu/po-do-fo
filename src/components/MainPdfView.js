import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentFrame from "./DocumentFrame";
import { movePageUp, movePageDown, removePage } from "../redux/actions";

import MainPdfViewStyles from "./MainPdfView.module.css";

function MainPdfView(props) {
  return (
    <div className={MainPdfViewStyles.documents}>
      {props.pages.length > 0 ? (
        props.pages.map((page, index) => {
          return (
            <div key={page.id} className={MainPdfViewStyles.documentContainer}>
              <div class={MainPdfViewStyles.document}>
                <DocumentFrame
                  pageBytes={page.bytes}
                  className={`page-${index}`}
                ></DocumentFrame>
              </div>
              <div className={MainPdfViewStyles.pageControls}>
                <button className="" onClick={() => props.movePageUp(index)}>
                  <i className="fas fa-chevron-up"></i>
                  Move up
                </button>
                <button className="" onClick={() => props.movePageDown(index)}>
                  <i className="fas fa-chevron-down"></i>
                  Move down
                </button>
                <Link to={`/edit/${index}`} className="">
                  <i className="fas fa-edit"></i>Edit page
                </Link>
                <button className="" onClick={() => props.removePage(index)}>
                  <i className="fas fa-trash"></i>
                  Remove page
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <h1 className={MainPdfViewStyles.loadDocHeader}>Load a document</h1>
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
  removePage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPdfView);
