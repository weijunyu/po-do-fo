import React from "react";
import { connect } from "react-redux";

import {
  startDrawing,
  stopDrawing,
  setShowSaveConfirmation
} from "../redux/actions";

import EditorViewControlsStyles from "./EditorViewControls.module.css";

const mapDispatchToProps = {
  startDrawing,
  stopDrawing,
  setShowSaveConfirmation
};

function mapStateToProps(state) {
  return {
    drawing: state.editor.drawing
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(function EditorViewControls(props) {
  function onDrawRectangleClick() {
    if (!props.drawing) {
      props.startDrawing({
        mode: "rectangle"
      });
    } else {
      props.onCancelDrawing();
    }
  }
  return (
    <div className={EditorViewControlsStyles["editor-controls"]}>
      <button>Choose Colour</button>
      <button
        className={`button is-small ${
          props.drawing && props.drawing.mode === "rectangle"
            ? "is-primary"
            : ""
        }`}
        onClick={onDrawRectangleClick}
      >
        Rectangle (fill)
      </button>
    </div>
  );
});
