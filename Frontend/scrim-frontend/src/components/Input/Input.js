import React from "react";
import styled from "styled-components";
import Colors from "../../global/styles/colors";

const ScInput = styled.input`
  font-family: "Source Sans Pro", sans-serif;
  height: 40px;
  min-width: ${props => (props.fluid ? "100%" : "8px")};
  width: ${props => (props.width ? `${props.width}px` : `80px`)};
  border-radius: 4px;
  background-color: #fff;
  border: ${props => (props.isValid === false ? "2px solid #D42727" : "none")};
  letter-spacing: 1px;
  font-size: 12px;
  padding: 11px 8px;
  box-sizing: border-box;
  color: ${Colors.darkText};

  ::placeholder {
    color: #9b9b9b;
  }

  :focus {
    outline: 0;
  }
`;

const Input = ({ type = "", value = "", onChange, placeholder = "", fluid, width, isValid }) => (
  <ScInput
    type={type}
    fluid={fluid}
    width={width}
    value={value}
    isValid={isValid}
    placeholder={placeholder}
    onChange={onChange}
    autoComplete="on"
  />
);

export default Input;
