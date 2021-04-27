import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import Expand from "react-expand-animated";
import styled from "styled-components";
import Colors from "../../../global/styles/colors";
import { Text, SubText, Button } from "../../../global/styles/styles";
import { formatInt, airTimeString } from "../../../global/utils/utils";
import { ArrowSVG } from "../../../components/SVGIcons";
import Creator from "../../../components/Creator";
import ErrorPopup from "../../../components/ErrorPopup";
import Copy from "../../../global/locales/en_us";
import { isUserLoggedIn } from "../../../global/utils/auth";
import { connectToUser } from "../../../global/api/endpoints";

const Container = styled.div`
  width: 100%;
  display: grid;
  position: relative;
  padding: 8px;
  box-shadow: 0px 0 4px 0 rgba(155, 155, 155, 0.5);
`;

const SubscribedContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 10px;
`;

const SubscribeButton = styled(Button)`
  background-color: ${Colors.subscribeButton};
  padding: 0px !important;
  height: 28px;
  width: 84px;
  font-weight: 700;
  letter-spacing: 0.5;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
  font-size: 14px;
  cursor: pointer;
`;

const SubscribedText = styled(Text)`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 700;
  padding-top: 6px;
  color: ${Colors.subscribedText};
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 20px;
  min-height: 22px;
  max-width: 75%;
  font-weight: 600;
  padding-top: 6px;
`;

const Viewers = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 6px;
`;

const ViewerCount = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const ViewerLabel = styled(ViewerCount)`
  font-size: 13px;
`;

const ArrowButtonContainer = styled.div`
  position: absolute;
  right: 8px;
  bottom: 4px;
  transform: ${props => (props.showDetails === true ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 300ms ease-in-out;
  cursor: pointer;
`;

const AirTime = styled(SubText)`
  font-size: 12px;
  line-height: 15px;
`;

const Description = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  padding-top: 12px;
  padding-bottom: 22px;
  white-space: pre-line;
`;

class VideoDescriptor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetails: false,
      followed: false,
      followError: false
    };
  }

  componentDidMount() {}

  toggleShowDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  subscribeClicked = () => {
    const isLoggedIn = isUserLoggedIn();
    if (!isLoggedIn) {
      gtag("event", "connect_clicked_unauthenticated", "watch");
      this.props.history.push("/register");
      return;
    }

    const { broadcaster } = this.props;
    const { id } = broadcaster;
    connectToUser(id).then(res => {
      if (!res.status.error) {
        gtag("event", "connect_clicked", "watch");
        this.setState({ followed: true });
      } else {
        gtag("event", "connect_error", "watch");
        this.setState({ followError: true });
      }
    });
  };

  render() {
    const { title, live = false, viewerCount, airtime, description, broadcaster, runtime } = this.props;
    const { showDetails, followed, followError } = this.state;

    return (
      <Container>
        <Helmet>
          <title>{`Scrim TV: ${broadcaster.displayName} presents ${title}`}</title>
          <meta
            name="description"
            content={`${broadcaster.displayName} presents ${title}, 
              Views: ${viewerCount},
              Runtime: ${runtime} seconds,
              Published ${airtime}`}
          />
        </Helmet>
        <SubscribedContainer>
          {broadcaster.hasConnected || followed ? (
            <SubscribedText>{Copy.following}</SubscribedText>
          ) : (
            <SubscribeButton onClick={this.subscribeClicked}>{Copy.connect}</SubscribeButton>
          )}
          {followError && <ErrorPopup message={Copy.followError} />}
        </SubscribedContainer>

        <Creator type="Broadcast" {...broadcaster} />
        <Title>{title}</Title>

        <Viewers>
          {/* <Maybe test={live}>
            <RedDot />
          </Maybe> */}
          <ViewerCount>{formatInt(viewerCount, showDetails)}</ViewerCount>
          <ViewerLabel>
            &nbsp;
            {live ? Copy.viewers : Copy.views}
          </ViewerLabel>
        </Viewers>
        <ArrowButtonContainer onClick={this.toggleShowDetails} showDetails={showDetails}>
          <ArrowSVG />
        </ArrowButtonContainer>

        <Expand open={showDetails} duration={300}>
          <AirTime>{`${airTimeString(live)} ${airtime}`}</AirTime>
          <Description>{description}</Description>
        </Expand>
      </Container>
    );
  }
}

export default withRouter(VideoDescriptor);
