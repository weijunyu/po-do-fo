import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";
import { colorDataToCssAttribute } from "../lib";

import { startDrawing, setFillColour } from "../redux/actions";

import EditorViewControlsStyles from "./EditorViewControls.module.css";

export default connect((state) => ({ drawing: state.editor.drawing }), {
  startDrawing,
})(function EditorViewControls(props) {
  function onDrawRectangleClick() {
    if (!props.drawing) {
      props.startDrawing({
        mode: "rectangle",
      });
    } else {
      props.onCancelDrawing();
    }
  }
  return (
    <div className={EditorViewControlsStyles["editor-controls"]}>
      <ColorPickerControls />

      <button
        className={`button ${
          props.drawing && props.drawing.mode === "rectangle"
            ? "is-light"
            : "is-white"
        }`}
        onClick={onDrawRectangleClick}
      >
        Rectangle (fill)
      </button>
    </div>
  );
});

const ColorPickerControls = connect(
  (state) => ({ fillColour: state.editor.fillColour }),
  { setFillColour }
)((props) => {
  const showPickerButtonRef = React.createRef();
  const [showColourPicker, setShowColourPicker] = useState(false);
  function onColourSet(colour) {
    props.setFillColour(colour.rgb);
  }
  return (
    <>
      <button
        onClick={() => setShowColourPicker(!showColourPicker)}
        className={`button ${showColourPicker ? "is-light" : "is-white"}`}
        ref={showPickerButtonRef}
      >
        Choose Fill Colour
        <i
          className="fas fa-square"
          style={{
            color: colorDataToCssAttribute(props.fillColour),
            marginLeft: ".3rem",
            textShadow: "1px 1px 2px black",
          }}
        ></i>
      </button>
      {showColourPicker ? (
        <ColorPickerContainer
          fillColour={props.fillColour}
          onColourSet={onColourSet}
          onHide={() => setShowColourPicker(false)}
          showPickerButtonRef={showPickerButtonRef}
        />
      ) : null}
    </>
  );
});

function ColorPickerContainer(props) {
  const containerRef = React.createRef();
  useEffect(() => {
    function hideMyself(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        props.showPickerButtonRef.current &&
        !props.showPickerButtonRef.current.contains(e.target)
      ) {
        props.onHide();
      }
    }
    document.addEventListener("mousedown", hideMyself);
    return () => {
      document.removeEventListener("mousedown", hideMyself);
    };
  }, [containerRef, props]);
  return (
    <div
      style={{
        position: "absolute",
        top: "2.5rem",
        zIndex: 1,
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
