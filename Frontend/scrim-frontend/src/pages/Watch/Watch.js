import React, { Component } from "react";
import styled from "styled-components";
import queryString from "query-string";
import { Screen, HeaderPadding, FooterPadding } from "../../global/styles/styles";
import Copy from "../../global/locales/en_us";
import { ShareSVG } from "../../components/SVGIcons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import VideoPlayer from "../../components/VideoPlayer";
import VideoDescriptor from "./Components/VideoDescriptor";
import Reactions from "./Components/Reactions";
import SimilarCreators from "./Components/SimilarCreators";
import SimilarBroadcasts from "./Components/SimilarBroadcasts";
import MediaQuery from "react-responsive";
import { updateViewCount } from "../../global/api/endpoints";

const VideoPlaybackContainer = styled.div`
  @media ${Screen.largeQuery} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 42px;
  }
`;

const DesktopVideoContainer = styled.div`
  display: inline-flex;
  padding-left: 12px;
  padding-top: 12px;
`;

const ShareAndReactionsContainer = styled.div`
  width: 100%;
  position: relative;
`;

const ShareIconContainer = styled.div`
  width: 26px;
  float: left;
  margin-left: 8px;
  margin-top: 8px;
  position: absolute;
  cursor: pointer;
`;

const RightSideContentContainer = styled.div`
  padding-left: 8px;
`;

class Watch extends Component {
  constructor(props) {
    super(props);

    const { broadcastId, channel } = queryString.parse(this.props.location.search);

    this.state = {
      broadcastId: broadcastId,
      channelId: channel
    };
  }

  componentDidMount() {
    const { fetchVideoData } = this.props;
    fetchVideoData(this.state.broadcastId);
    this.videoViewed();
  }

  videoViewed = () => {
    updateViewCount(this.state.broadcastId).then(res => {});
  };

  getWidth = isDesktop => {
    if (!isDesktop) {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width - 552;
  };

  shareClicked = () => {
    console.log(`Sharing: ${this.state.broadcastId}`);
  };

  render() {
    let { broadcast } = this.props.location;
    const { fetching, similarCreators, similarBroadcasts } = this.props;
    const isDesktop = window.matchMedia(Screen.largeQuery).matches;

    if (!broadcast) {
      broadcast = this.props.broadcast;
    }

    const heightWideScreen = Math.floor((this.getWidth(isDesktop) * 9) / 16);

    let videoJsOptions = {
      autoplay: true,
      controls: true,
      height: heightWideScreen
    };
    if (broadcast && broadcast.streamId) {
      const videoSrc = `https://d24pnts4z5s98x.cloudfront.net/${broadcast.streamId}/${broadcast.streamId}-720.M3U8`;
      videoJsOptions.sources = [
        {
          src: videoSrc,
          type: "application/x-mpegURL"
        }
      ];
    }

    return (
      <React.Fragment>
        <MediaQuery query={Screen.largeQuery}>
          {matches =>
            matches ? (
              <React.Fragment>
                <Header title={Copy.nowPlaying} />
                <HeaderPadding />
                <DesktopVideoContainer>
                  <VideoPlaybackContainer>
                    {videoJsOptions.sources && <VideoPlayer {...videoJsOptions} />}
                    {!fetching &&
                      broadcast && (
                        <React.Fragment>
                          <VideoDescriptor {...broadcast} />
                          <ShareAndReactionsContainer>
                            <ShareIconContainer onClick={this.shareClicked}>
                              <ShareSVG />
                            </ShareIconContainer>
                            <Reactions />
                          </ShareAndReactionsContainer>
                        </React.Fragment>
                      )}
                  </VideoPlaybackContainer>
                  <RightSideContentContainer>
                    {similarCreators && <SimilarCreators similarCreators={similarCreators} />}
                    {similarBroadcasts && <SimilarBroadcasts similarBroadcasts={similarBroadcasts} />}
                  </RightSideContentContainer>
                </DesktopVideoContainer>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Header title={Copy.nowPlaying} />
                <HeaderPadding />
                <VideoPlaybackContainer>
                  {videoJsOptions.sources && <VideoPlayer {...videoJsOptions} />}
                  {!fetching &&
                    broadcast && (
                      <React.Fragment>
                        <VideoDescriptor {...broadcast} />
                        <ShareAndReactionsContainer>
                          <ShareIconContainer onClick={this.shareClicked}>
                            <ShareSVG />
                          </ShareIconContainer>
                          <Reactions />
                        </ShareAndReactionsContainer>
                        {similarCreators && <SimilarCreators similarCreators={similarCreators} />}
                        {similarBroadcasts && <SimilarBroadcasts similarBroadcasts={similarBroadcasts} />}
                      </React.Fragment>
                    )}
                </VideoPlaybackContainer>
              </React.Fragment>
            )
          }
        </MediaQuery>
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Watch;
