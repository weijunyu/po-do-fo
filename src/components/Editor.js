import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { connect } from "react-redux";
import EditorView from "./EditorView";

function Editor(props) {
  const routeParams = useParams();
  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }
  const pageIndex = parseInt(routeParams.pageIndex);
  const page = props.pages[pageIndex];
  return <EditorView page={page} pageIndex={pageIndex} />;
}

export default connect(function mapStateToProps(state) {
  return {
    pages: state.pages,
  };
})(Editor);
