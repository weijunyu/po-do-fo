import React, { useState } from "react";
import { connect } from "react-redux";
import { SketchPicker } from "react-color";

import { startDrawing } from "../redux/actions";

import EditorViewControlsStyles from "./EditorViewControls.module.css";

const mapDispatchToProps = {
  startDrawing
};

function mapStateToProps(state) {
  return {
    drawing: state.editor.drawing
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorViewControls);

function EditorViewControls(props) {
  const [showColourPicker, setShowColourPicker] = useState(false);

  function onDrawRectangleClick() {
    if (!props.drawing) {
      props.startDrawing({
        mode: "rectangle"
      });
    } else {
      props.onCancelDrawing();
    }
  }
  function onChooseColourClick() {
    setShowColourPicker(!showColourPicker);
  }
  function onColourSet(colour, event) {
    console.log(colour);
    console.log(event);
  }
  return (
    <div className={EditorViewControlsStyles["editor-controls"]}>
      <button onClick={onChooseColourClick} className="button is-small">
        Choose Colour
      </button>
      {showColourPicker ? (
        <div
          style={{
            position: "absolute",
            top: "2rem",
            zIndex: 1
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px"
            }}
            onClick={() => setShowColourPicker(false)}
          ></div>
          <SketchPicker color="#fff" onChangeComplete={onColourSet} />
        </div>
      ) : null}

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
}
