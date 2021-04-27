import styled, { keyframes } from "styled-components";
import Colors from "./colors";
import { Link as ReactLink } from "react-router-dom";

export const Text = styled.p`
  font-family: "Kilroy";
  font-size: 12px;
  color: ${Colors.darkText};
  margin: 0px;
`;

export const SubText = styled(Text)`
  color: ${Colors.darkSubText};
`;

export const ContentText = styled(Text)`
  font-size: 18px;
  font-weight: 400;
  padding: 8px;
`;

export const ContentFirstLetter = styled.span`
  color: ${Colors.presentsAccent};
  float: left;
  font-family: Georgia;
  font-weight: 700;
  font-size: 76px;
  line-height: 60px;
  padding-top: 4px;
  padding-right: 8px;
  padding-left: 3px;
`;

export const ContentFirstWord = styled.span`
  color: ${Colors.presentsAccent};
  font-family: Georgia;
  font-size: 18px;
  font-weight: 700;
  line-height: 16px;
`;

export const Link = styled(ReactLink)`
  text-decoration: none;
`;

export const Button = styled.button`
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  border: none;
  border-radius: 2px;
  color: ${Colors.lightText};
  cursor: pointer;
  outline: none;
  margin: 0px;
`;

export const Screen = {
  largeQuery: `(min-width: 1140px)`,
  mediumQuery: `(min-width: 768px) and (max-width: 1139px)`,
  smallQuery: `(min-width: 360px) and (max-width: 767px)`,
  tinyQuery: `(max-width: 359px)`
};

export const HeaderPadding = styled.div`
  padding-top: 48px;
`;

export const FooterPadding = styled.div`
  /* padding-top: 52px; */
  padding-top: 118px;
`;

export const Label = styled.label`
  width: 100%;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 17px;
  font-weight: 700 !important;
  color: #ffffff !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 12px;
  padding-bottom: 2px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  margin-top: 3px;
  width: 35%;
  height: 80%;

  &:after {
    content: " ";
    display: block;
    width: auto;
    height: 100%;
    margin: 1px;
    border-radius: 50%;
    border: 4px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;
