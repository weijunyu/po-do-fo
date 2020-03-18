import React, { useState } from "react";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";

import { startDrawing, setFillColour } from "../redux/actions";

import EditorViewControlsStyles from "./EditorViewControls.module.css";

const mapDispatchToProps = {
  startDrawing,
  setFillColour
};

function mapStateToProps(state) {
  return {
    drawing: state.editor.drawing,
    fillColour: state.editor.fillColour
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
  function onColourSet(colour) {
    props.setFillColour(colour.rgb);
  }
  return (
    <div className={EditorViewControlsStyles["editor-controls"]}>
      <button
        onClick={() => setShowColourPicker(!showColourPicker)}
        className="button is-small"
      >
        Choose Fill Colour
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
          <ChromePicker
            color={props.fillColour}
            onChangeComplete={onColourSet}
          />
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
