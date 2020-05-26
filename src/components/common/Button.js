import styled from "styled-components";

import * as Colours from "../../lib/colours";

export const PrimaryButton = styled.button`
  border-radius: 4px;
  background-color: ${Colours.Primary};
  color: white;
  cursor: pointer;
  border: none;
  padding: 0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  i {
    margin-right: 7px;
  }
  :link,
  :visited {
    text-decoration: none;
  }
  :hover {
    background-color: ${Colours.PrimaryLight};
  }
  :active,
  :focus {
    background-color: ${Colours.PrimaryDark};
  }
`;

export const LightButton = styled(PrimaryButton)`
  color: ${Colours.Dark};
  background-color: ${Colours.Light};
  :hover {
    background-color: ${Colours.LightDark};
  }
  :active,
  :focus {
    background-color: ${Colours.LightLight};
  }
`;

export const AccentButton = styled(PrimaryButton)`
  color: ${Colours.Dark};
  background-color: ${Colours.Accent};
  :hover {
    background-color: ${Colours.AccentDark};
  }
  :active,
  :focus {
    background-color: ${Colours.AccentLight};
  }
`;
