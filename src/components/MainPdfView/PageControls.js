import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Light } from "../../lib/colours";
import { PrimaryButton, LightButton } from "../common/Button";
import { movePageUp, movePageDown, removePage } from "../../redux/actions";

const mapDispatchToProps = {
  movePageUp,
  movePageDown,
  removePage,
};
const StyledPageControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
  background: ${Light};
  & > *:not(:last-child) {
    margin-bottom: 4px;
  }
`;

function PageControls({ pageIndex, movePageUp, movePageDown, removePage }) {
  return (
    <StyledPageControls>
      <PrimaryButton onClick={() => movePageUp(pageIndex)}>
        <i className="fas fa-chevron-up"></i>
        Move up
      </PrimaryButton>
      <PrimaryButton onClick={() => movePageDown(pageIndex)}>
        <i className="fas fa-chevron-down"></i>
        Move down
      </PrimaryButton>
      <PrimaryButton as={Link} to={`/edit/${pageIndex}`}>
        <i className="fas fa-edit"></i>
        Edit page
      </PrimaryButton>
      <LightButton onClick={() => removePage(pageIndex)}>
        <i className="fas fa-trash"></i>
        Remove page
      </LightButton>
    </StyledPageControls>
  );
}

export default connect(null, mapDispatchToProps)(PageControls);
