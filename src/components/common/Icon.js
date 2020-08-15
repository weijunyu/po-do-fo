import React from "react";
import styled from "styled-components";

const IconContainer = styled.i`
  display: flex;
  align-items: center;
`;

export default function Icon({ name, ...otherProps }) {
  return (
    <IconContainer className={`fas ${name}`} {...otherProps}></IconContainer>
  );
}
