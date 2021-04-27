import React from "react";
import styled from "styled-components";
import { Text, Link, Screen } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";

const StaticHeader = styled.header`
  background: #2d72d5;
  width: 100vw;
  height: 48px;
  top: 0;
  position: fixed;
  display: inline-flex;
  z-index: 10;
  color: ${Colors.lightText};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.3);
  background-color: #892d82;
  background-image: linear-gradient(225deg, #975b97 15%, #5e88cb 99%);
`;

const StaticContainer = styled.div`
  width: 30vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MiddleStaticContainer = styled.div`
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderTextBase = styled(Text)`
  color: ${Colors.lightText};
  display: inline;
  font-size: 14px;
  font-weight: 700;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.9px;
  color: #ffffff;

  @media ${Screen.largeQuery} {
    font-size: 16px;
  }
`;

const StaticLabelText = HeaderTextBase.extend`
  padding-left: 12px;
  margin-top: 0px;
  width: 30vw;
`;

const ScrimLogoContainer = styled.div`
  padding-top: 4px;
`;

const ScrimLogo = styled.img`
  height: 42px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title } = this.props;
    return (
      <StaticHeader>
        <StaticContainer>
          <StaticLabelText>{title.toUpperCase()}</StaticLabelText>
        </StaticContainer>
        <MiddleStaticContainer>
          <Link to={{ pathname: "/" }}>
            <ScrimLogoContainer>
              <ScrimLogo src={"https://128.0.0.1/scrim-frontend/Scrim-Logo-Web.png"} />
            </ScrimLogoContainer>
          </Link>
        </MiddleStaticContainer>
        <StaticContainer>{/* <StaticHamburgerIcon src={Menu} /> */}</StaticContainer>
      </StaticHeader>
    );
  }
}

export default Header;
