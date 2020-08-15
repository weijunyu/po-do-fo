import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";
import styled from "styled-components";

import { startDrawing, setFillColour } from "../redux/actions";

import { colorDataToCssAttribute } from "../lib";
import { LightButton, AccentButton } from "./common/Button";
import Icon from "./common/Icon";

const EditorControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem 1rem;
  button:not(:last-child) {
    margin-right: 1rem;
  }
`;

export default connect((state) => ({ drawing: state.editor.drawing }), {
  startDrawing,
})(function EditorViewControls({ drawing, startDrawing, onCancelDrawing }) {
  function onDrawRectangleClick() {
    if (!drawing) {
      startDrawing({
        mode: "rectangle",
      });
    } else {
      onCancelDrawing();
    }
  }
  return (
    <EditorControlsContainer>
      <ColorPickerControls />
      <LightButton
        onClick={onDrawRectangleClick}
        active={drawing && drawing.mode === "rectangle"}
      >
        Rectangle (fill)
      </LightButton>
      {drawing && drawing.mode === "rectangle" ? (
        <>
          <Icon name="fa-angle-right" style={{ marginRight: "1rem" }}></Icon>
          <AccentButton onClick={onCancelDrawing}>Done</AccentButton>
        </>
      ) : null}
    </EditorControlsContainer>
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
      <LightButton
        onClick={() => setShowColourPicker(!showColourPicker)}
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
      </LightButton>
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
