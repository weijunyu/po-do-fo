import React, { useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useRouteMatch, Link } from "react-router-dom";
import Uppy from "@uppy/core";
import DragDrop from "@uppy/drag-drop";
import styled from "styled-components";

import { PrimaryButton } from "./common/Button";
import { loadPagesFromFile, stopDrawing, setShowSaveConfirmation } from "../redux/actions";
import { exportPdf, exportPdfInImages } from "../lib";
import DrawableCanvasContext from "../context/DrawableCanvasContext";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

const StyledSidebar = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 6rem;
  padding: 0.5rem;
  background-color: white;
  border-top: 1px solid grey;
  display: flex;
`;

const StyledPdfLoader = styled.div`
  display: flex;
  width: 100%;
  .pdf-loader {
    flex: 1 1 auto;
  }
  & > *:not(:last-child) {
    margin-right: 6px;
  }
  & .uppy-DragDrop-inner {
    display: flex;
    align-items: center;
    padding: 0;
  }
  & .uppy-DragDrop-arrow {
    margin-bottom: 0;
  }
`;

const BackButton = styled(PrimaryButton)`
  flex: 1 1 auto;
  justify-content: center;
`;

function mapStateToProps(state) {
  return { pages: state.pages };
}

const mapDispatchToProps = {
  loadPagesFromFile,
  stopDrawing,
  setShowSaveConfirmation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

function Sidebar(props) {
  const match = useRouteMatch("/edit");

  const { clearCanvas } = useContext(DrawableCanvasContext);

  function cancelDrawing() {
    props.stopDrawing();
    props.setShowSaveConfirmation(false);
    clearCanvas();
  }

  return (
    <StyledSidebar>
      {match ? (
        <BackButton to="/" as={Link} onClick={cancelDrawing}>
          Back
        </BackButton>
      ) : (
        <PdfLoader pages={props.pages} loadPagesFromFile={props.loadPagesFromFile} />
      )}
    </StyledSidebar>
  );
}

function PdfLoader({ pages, loadPagesFromFile }) {
  useEffect(() => {
    Uppy({
      onBeforeFileAdded: (currentFile) => {
        // Use this to load files into state
        // Uppy blocks re-uploads by default
        loadPagesFromFile(currentFile);
      },
    }).use(DragDrop, {
      target: ".pdf-loader",
    });
  }, [loadPagesFromFile]);

  return (
    <StyledPdfLoader>
      <div className="pdf-loader" />
      {pages.length > 0 ? (
        <>
          <PrimaryButton onClick={() => exportPdf(pages)}>Export PDF</PrimaryButton>
          <PrimaryButton onClick={exportPdfInImages}>Export PDF (Image Mode)</PrimaryButton>
        </>
      ) : null}
    </StyledPdfLoader>
  );
}
