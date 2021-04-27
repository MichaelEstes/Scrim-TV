import React from "react";
import styled from "styled-components";

const ScButton = styled.button`
  font-family: "Source Sans Pro", sans-serif;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.9px;
  width: 270px;
  height: 56px;
  background-color: ${props => props.backgroundcolor};
  min-width: ${props => (props.fluid ? `100%` : `fit-content`)};
  border-style: none;
  font-size: 14px;
  color: #fff;

  :focus {
    outline: 0;
  }
`;

const Button = ({ children, fluid, onClick, backgroundcolor = "#39579d", ...other }) => (
  <ScButton backgroundcolor={backgroundcolor} fluid={fluid} onClick={onClick} {...other}>
    {children}
  </ScButton>
);

export default Button;
