import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { Secondary } from "../../lib/colours";

import DocumentFrame from "../DocumentFrame";
import PageControls from "./PageControls";

function mapStateToProps(state) {
  return { pages: state.pages };
}

const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DocumentContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  &:not(:last-child) {
    border-bottom: 1rem solid ${Secondary}
  }
`;

const StyledDocument = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

const LoadDocumentHeading = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
`;

function MainPdfView(props) {
  return (
    <DocumentsContainer>
      {props.pages.length > 0 ? (
        props.pages.map((page, index) => {
          return (
            <DocumentContainer key={page.id}>
              <StyledDocument>
                <DocumentFrame pageBytes={page.bytes}></DocumentFrame>
              </StyledDocument>
              <PageControls pageIndex={index} />
            </DocumentContainer>
          );
        })
      ) : (
        <LoadDocumentHeading>Load a document</LoadDocumentHeading>
      )}
    </DocumentsContainer>
  );
}

export default connect(mapStateToProps)(MainPdfView);
