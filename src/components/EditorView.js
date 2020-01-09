import React from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import DocumentFrame from "./DocumentFrame";

function EditorView(props) {
  const { pageIndex } = useParams();

  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DocumentFrame
        pageBytes={props.pages[pageIndex]}
        title={`page-${pageIndex}`}
      />
    </div>
  );
}
function mapStateToProps(state) {
  return { pages: state.pages };
}
export default connect(mapStateToProps)(EditorView);
