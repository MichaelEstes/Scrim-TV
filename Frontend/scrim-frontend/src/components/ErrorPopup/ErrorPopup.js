import React from "react";
import { Text } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";
import styled, { keyframes } from "styled-components";

const FullWidthContainer = styled.div`
  width: 100vw;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 99;
`;

const slideIn = keyframes`
  0%, 100% {
    transform: translatey(-120%);
  }

  20%, 60% {
    transform: translatey(0%);
  }
`;

const ErrorContainer = styled.div`
  height: 52px;
  max-width: 480px;
  background: ${Colors.error};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  transform: translatey(-120%);
  animation: ${slideIn} 3s ease;
`;

const ErrorText = styled(Text)`
  color: ${Colors.lightText};
  padding-left: 18px;
  padding-right: 18px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.7px;
`;

class ErrorPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: false
    };
  }

  animationOver = () => {
    this.setState({ shown: true });
  };

  render() {
    const { message } = this.props;
    const { shown } = this.state;
    return (
      <React.Fragment>
        {!shown && (
          <FullWidthContainer>
            <ErrorContainer onAnimationEnd={this.animationOver}>
              <ErrorText>{message}</ErrorText>
            </ErrorContainer>
          </FullWidthContainer>
        )}
      </React.Fragment>
    );
  }
}

export default ErrorPopup;
