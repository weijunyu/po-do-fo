import React from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router-dom";

function EditorView(props) {
  const { pageIndex } = useParams();

  if (props.pages.length === 0) {
    return <Redirect to="/" />;
  }

  const blob = new Blob([props.pages[pageIndex]], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  return (
    <iframe
      src={`${blobUrl}#view=fitH&toolbar=0&navpanes=0`}
      title={`page-${pageIndex}`}
      style={{ flex: "1 1 auto" }}
    ></iframe>
  );
}
function mapStateToProps(state) {
  return { pages: state.pages };
}
export default connect(mapStateToProps)(EditorView);
