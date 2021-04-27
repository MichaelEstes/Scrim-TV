import React from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import Colors from "../../global/styles/colors";
import Copy from "../../global/locales/en_us";
import { Text, Link, Button, Screen } from "../../global/styles/styles";

const Container = styled.div`
  width: 100vw;
  height: 200px;
  background-color: ${Colors.skeletonLighter};
  display: flex;
  margin-top: 52px;
`;

const LeftContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

const ScrimText = styled(Text)`
  padding-top: 42px;
`;

const RightItemList = styled.div`
  padding-top: 21px;
`;

const RightItemText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  padding-top: 12px;
`;

const ContactLink = styled.a`
  text-decoration: none;
`;

class CompanyFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container>
        <LeftContainer>
          <ScrimText>Scrim TV Inc.</ScrimText>
        </LeftContainer>
        <RightContainer>
          <RightItemList>
            <Link to={{ pathname: "/about" }}>
              <RightItemText>{Copy.about}</RightItemText>
            </Link>
            <ContactLink href="mailto:contact@scrim.tv">
              <RightItemText>{Copy.contact}</RightItemText>
            </ContactLink>
          </RightItemList>
        </RightContainer>
      </Container>
    );
  }
}

export default withRouter(CompanyFooter);
