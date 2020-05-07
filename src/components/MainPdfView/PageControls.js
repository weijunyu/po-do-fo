import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Light } from "../../lib/colours";
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
`;
function PageControls({ pageIndex, movePageUp, movePageDown, removePage }) {
  return (
    <StyledPageControls>
      <button className="" onClick={() => movePageUp(pageIndex)}>
        <i className="fas fa-chevron-up"></i>
        Move up
      </button>
      <button className="" onClick={() => movePageDown(pageIndex)}>
        <i className="fas fa-chevron-down"></i>
        Move down
      </button>
      <Link to={`/edit/${pageIndex}`} className="">
        <i className="fas fa-edit"></i>Edit page
      </Link>
      <button className="" onClick={() => removePage(pageIndex)}>
        <i className="fas fa-trash"></i>
        Remove page
      </button>
    </StyledPageControls>
  );
}

export default connect(null, mapDispatchToProps)(PageControls);
