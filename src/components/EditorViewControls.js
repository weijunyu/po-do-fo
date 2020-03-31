import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";
import { colorDataToCssAttribute } from "../lib";

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
        <i
          className="fas fa-square"
          style={{
            color: colorDataToCssAttribute(props.fillColour),
            paddingLeft: ".3rem"
          }}
        ></i>
      </button>
      {showColourPicker ? (
        <ColorPickerContainer
          fillColour={props.fillColour}
          onColourSet={onColourSet}
          onHide={() => setShowColourPicker(false)}
        />
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

function ColorPickerContainer(props) {
  const containerRef = React.createRef();
  useEffect(() => {
    function hideMyself(e) {
      if (!containerRef.current.contains(e.target)) {
        props.onHide();
      }
    }
    document.addEventListener("click", hideMyself);
    return () => {
      document.removeEventListener("click", hideMyself);
    };
  }, [containerRef, props]);
  return (
    <div
      style={{
        position: "absolute",
        top: "2rem",
        zIndex: 1
      }}
      ref={containerRef}
    >
      <ChromePicker
        disableAlpha={true}
        color={props.fillColour}
        onChangeComplete={props.onColourSet}
      />
    </div>
  );
}
