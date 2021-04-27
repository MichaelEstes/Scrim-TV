import React from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import { PeopleSVG, ProfileSVG, ProjectSVG, WatchSVG, AddSVG, FeedbackSVG, CancelSVG } from "../SVGIcons";
import Colors from "../../global/styles/colors";
import Copy from "../../global/locales/en_us";
import { Text, Link, Button, Screen } from "../../global/styles/styles";
import ContentSubmission from "../ContentSubmission";
import { postFeedback } from "../../global/api/endpoints";
import { isUserLoggedIn } from "../../global/utils/auth";

const FullWidthContainer = styled.footer`
  width: 100vw;
  height: 50px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
`;

const FooterContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: 480px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 8px 8px 0px 0px;
  padding: 9px 32px 7px 32px;
  display: flex;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconImageContainer = styled.div`
  height: 20px;
`;

const IconDisplayText = styled(Text)`
  font-size: 10px;
  font-weight: 700;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.3px;
  text-align: center;
  color: rgba(72, 72, 72, 0.95);
  margin: 5px 0px 0px 0px;
  padding: 0;
`;

const FeedbackButtonContainer = styled.div`
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 56px;
  right: 8px;
`;

const FeedbackButton = styled(Button)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${Colors.scrimBlue};
  cursor: pointer;
  box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeedbackContainer = styled.div`
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(100, 100, 100, 0.75);
`;

const FeedbackInputContainer = styled.div`
  width: 720px;
  max-width: 90%;
  height: 360px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.4);
`;

const FeedbackHeader = styled.div`
  width: 100%;
  display: flex;
`;

const CancelButton = styled.div`
  padding-top: 12px;
  margin-top: 8px;
  margin-left: 16px;
  cursor: pointer;
`;

const FeedbackTitle = styled(Text)`
  padding-top: 12px;
  padding-left: 24px;
  font-size: 24px;
  font-weight: 600;
`;

const FeedbackTextInputContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const FeedbackTextInput = styled.textarea`
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  color: ${Colors.darkText};
  width: 80%;
  margin-top: 18px;
  padding: 12px;

  @media ${Screen.smallQuery} {
    border-top: 1px solid ${Colors.border};
  }

  @media ${Screen.tinyQuery} {
    border-top: 1px solid ${Colors.border};
  }
`;

const SubmitButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
  padding-right: 32px;
`;

const SubmitButton = styled(Button)`
  background-color: ${Colors.subscribeButton};
  height: 42px;
  width: 112px;
  font-weight: 700;
  font-size: 14px;
  margin-top: 4px;
  letter-spacing: 0.5;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
`;

const AddContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: center;
  bottom: 48px;
`;
const AddButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${Colors.scrimBlue};
  cursor: pointer;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${props => (props.toggled === true ? "rotate(45deg)" : "none")};
  transition: 0.3s ease;
`;

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFeedbackInput: false,
      feedback: "",
      showSumbmitContent: false
    };
  }

  feedbackClicked = () => {
    gtag("event", "feedback_clicked");
    this.setState({
      showFeedbackInput: true
    });
  };

  cancelFeedback = () => {
    gtag("event", "feedback_cancelled");
    this.setState({
      showFeedbackInput: false
    });
  };

  feedbackChanged = event => {
    this.setState({
      feedback: event.target.value
    });
  };

  submitFeedback = () => {
    if (this.state.feedback) {
      const body = {
        feedback: this.state.feedback
      };
      postFeedback(body);
    }

    gtag("event", "feedback_submitted");
    this.setState({
      showFeedbackInput: false
    });
  };

  addClicked = () => {
    const isLoggedIn = isUserLoggedIn();
    if (isLoggedIn) {
      if (this.state.showSumbmitContent) {
        gtag("event", "add_content_cancelled");
      } else {
        gtag("event", "add_content_clicked");
      }
      this.setState({
        showSumbmitContent: !this.state.showSumbmitContent
      });
    } else {
      gtag("event", "add_content_unauthenticated");
      this.props.history.push("/register");
    }
  };

  onSumbitDone = res => {
    this.setState({
      showSumbmitContent: false
    });

    if (res.data) {
    } else {
    }
  };

  render() {
    const { showFeedbackInput, showSumbmitContent } = this.state;

    return (
      <React.Fragment>
        {showSumbmitContent && <ContentSubmission onDone={this.onSumbitDone} />}
        <FullWidthContainer>
          <FooterContainer>
            <Link to={{ pathname: "/" }} key={"CONTENT"}>
              <IconContainer>
                <IconImageContainer>
                  <WatchSVG />
                </IconImageContainer>
                <IconDisplayText>{Copy.content}</IconDisplayText>
              </IconContainer>
            </Link>
            <Link to={{ pathname: "/projects" }} key={"PROJECTS"}>
              <IconContainer>
                <IconImageContainer>
                  <ProjectSVG />
                </IconImageContainer>
                <IconDisplayText>{Copy.projects}</IconDisplayText>
              </IconContainer>
            </Link>
            <Link to={{ pathname: "/connect" }} key={"CONNECT"}>
              <IconContainer>
                <IconImageContainer>
                  <PeopleSVG />
                </IconImageContainer>
                <IconDisplayText>{Copy.connectTab}</IconDisplayText>
              </IconContainer>
            </Link>
            {/* <Link to={{ pathname: "/list" }} key={"LIST"}>
        <IconContainer>
          <IconImageContainer>
            <BookmarkSVG />
          </IconImageContainer>
          <IconDisplayText>{Copy.myList}</IconDisplayText>
        </IconContainer>
      </Link> */}

            {/* <Link to={{ pathname: "/search" }} key={"SEARCH"}>
        <IconContainer>
          <IconImageContainer>
            <SearchSVG width="14px" height="15px" />
          </IconImageContainer>
          <IconDisplayText>{Copy.search}</IconDisplayText>
        </IconContainer>
      </Link> */}
            <Link to={{ pathname: "/profile" }} key={"PROFILE"}>
              <IconContainer>
                <IconImageContainer>
                  <ProfileSVG width="14px" height="15px" />
                </IconImageContainer>
                <IconDisplayText>{Copy.profile}</IconDisplayText>
              </IconContainer>
            </Link>
          </FooterContainer>
          <AddContainer>
            <AddButton onClick={this.addClicked} toggled={showSumbmitContent}>
              <AddSVG />
            </AddButton>
          </AddContainer>
        </FullWidthContainer>
        {/* <FeedbackButtonContainer>
          <FeedbackButton onClick={this.feedbackClicked}>
            <FeedbackSVG />
          </FeedbackButton>
        </FeedbackButtonContainer> */}

        {showFeedbackInput && (
          <FeedbackContainer>
            <FeedbackInputContainer>
              <FeedbackHeader>
                <CancelButton onClick={this.cancelFeedback}>
                  <CancelSVG />
                </CancelButton>
                <FeedbackTitle>{Copy.feedback}</FeedbackTitle>
              </FeedbackHeader>
              <FeedbackTextInputContainer>
                <FeedbackTextInput
                  maxLength="1024"
                  rows="5"
                  placeholder={Copy.feedbackPrompt}
                  value={this.state.feedbackChanged}
                  onChange={this.feedbackChanged}
                />
              </FeedbackTextInputContainer>
              <SubmitButtonContainer>
                <SubmitButton onClick={this.submitFeedback}>{Copy.submit}</SubmitButton>
              </SubmitButtonContainer>
            </FeedbackInputContainer>
          </FeedbackContainer>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Footer);
