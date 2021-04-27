import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import styled, { css } from "styled-components";
import { Text, Button, FooterPadding } from "../../global/styles/styles";
import { formatInt } from "../../global/utils/utils";
import Colors from "../../global/styles/colors";
import {
  ListContainer,
  SectionList,
  BroadcastContainer,
  SectionTitleContainer,
  SectionTitleTextContainer,
  SectionTitle,
  SectionSubText
} from "../Home/Home";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import Broadcast from "../../components/Broadcast";
import Paper from "../../components/Paper";
import Copy from "../../global/locales/en_us";
import { connectToUser, getUserEmail } from "../../global/api/endpoints";
import { isUserLoggedIn } from "../../global/utils/auth";

const ProfileHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  padding-top: 52px;
  justify-content: center;
`;

const ProfileHeaderBackground = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 190px;
  background-color: #892d82;
  background-image: linear-gradient(225deg, #892d82 15%, #2b6ac5 99%);
`;

const UserHeaderInfo = styled.div`
  display: flex;
  width: 100%;
  padding-top: 6px;
  max-width: 760px;
`;

const UserTextContainer = styled.div`
  padding-left: 14px;
  display: grid;
  align-items: center;
`;

const UserTextInnerContainer = styled.div``;

const DisplayName = styled(Text)`
  font-size: 21px;
  font-weight: 600;
  /* color: ${Colors.lightText}; */
  letter-spacing: 0.8px;
  line-height: 27px;
  padding-top: 6px;
`;

const Vocations = styled(Text)`
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  padding-left: 2px;
  padding-top: 6px;
`;

const Formats = styled(Text)`
  font-size: 16px;
  text-transform: capitalize;
`;

const UserImage = styled.img`
  width: 140px;
  height: 140px;
  justify-self: center;
  margin-top: 8px;
  margin-left: 8px;
  border-radius: 50%;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
  content: ${props => (props.src ? props.src : "linear-gradient(-225deg, #ff3cac 0%, #784ba0 51%, #2b86c5 100%)")};
`;

const ConnectButtonContainer = styled.div`
  width: 100%;
  display: grid;
  padding-top: 4px;
`;

const ConnectButton = styled(Button)`
  background-color: ${Colors.subscribeButton};
  width: 100%;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 2px;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
  text-transform: uppercase;
  text-align: center;
  background-position: center;
  cursor: pointer;
`;

const Connections = styled.div`
  display: grid;
  padding-left: 2px;
  padding-top: 6px;
  width: fit-content;
`;

const FollowerCount = styled(Text)`
  font-size: 16px;
  letter-spacing: 0.4px;
  padding-bottom: 4px;
`;

const ProfileInfoContainer = styled.div`
  display: grid;
`;

const TaglineContainer = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  padding: 12px 8px;
`;

const AboutContainer = styled.div`
  display: grid;
  width: 100%;
  padding: 12px 8px;
`;

const AboutTitle = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-left: 1px;
  padding-top: 4px;
  text-transform: uppercase;
`;

const Underline = styled.div`
  height: 1px;
  background: #7b1253;
  width: 32px;
  margin-top: 4px;
`;

const ProfileTextContainer = styled.div`
  display: grid;
`;

const ProfileText = styled(Text)`
  padding-top: 8px;
  font-size: 16px;
  line-height: 18px;
  ${props =>
    !props.full
      ? css`
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          max-height: 72px;
        `
      : null};
`;

const ViewMoreButton = styled(Button)`
  color: ${Colors.presentsAccent};
  width: 72px;
  font-size: 14px;
  font-weight: 700;
  padding: 0px;
  margin-top: 4px;
  justify-self: end;
  background: none;
  text-transform: uppercase;
`;

const ProfilePrompt = styled(ProfileText)`
  color: ${Colors.darkSubText};
`;

const TaglineText = styled(ProfileText)`
  font-size: 16px;
  font-weight: 600;
  padding-top: 8px;
  padding-left: 2px;
`;

const TaglinePrompt = styled(ProfilePrompt)`
  text-align: center;
  max-width: 320px;
`;

const NonCenteredInfoContainer = styled.div`
  justify-self: center;
  width: 100%;
  max-width: 760px;
`;

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      connectError: false,
      showFullAbout: false,
      showFullVocations: false
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { fetchUserData } = this.props;
    fetchUserData(id);
  }

  componentWillUnmount() {}

  componentDidUpdate() {}

  connectUser = () => {
    const isLoggedIn = isUserLoggedIn();
    if (!isLoggedIn) {
      gtag("event", "connect_clicked_unauthenticated");
      this.props.history.push("/register");
      return;
    }

    const { id } = this.props.data;
    connectToUser(id).then(res => {
      if (!res.status.error) {
        gtag("event", "connect_clicked");
        this.setState({ isConnected: true });
      } else {
        gtag("event", "connect_error");
        this.setState({ connectError: true });
      }
    });
  };

  messageUser = () => {
    const { id } = this.props.data;
    getUserEmail(id).then(res => {
      if (res.data) {
        location.href = res.data;
      }
    });
  };

  showAbout = () => {
    gtag("event", "view_about_clicked");
    this.setState({ showFullAbout: true });
  };

  showVocations = () => {
    gtag("event", "view_vocations_clicked");
    this.setState({ showFullVocations: true });
  };

  getBroadcast = (broadcast, isLast) => {
    return (
      <BroadcastContainer showBorder={!isLast} key={broadcast.id}>
        <Broadcast {...broadcast} />
      </BroadcastContainer>
    );
  };

  getPaper = (paper, isLast) => {
    return (
      <BroadcastContainer showBorder={!isLast} key={paper.id}>
        <Paper {...paper} />
      </BroadcastContainer>
    );
  };

  render() {
    const { fetching, data } = this.props;
    let content;

    if (fetching) {
    } else if (data) {
      const {
        displayName,
        followerCount = 0,
        followingCount = 0,
        imageUrl = "",
        tagline = "",
        about = "",
        reel,
        hasConnected
      } = data;
      const { broadcasts, papers } = reel;
      const { showFullAbout, showFullVocations } = this.state;
      let { vocations = [], formats = [] } = data;

      const isConnected = this.state.isConnected || hasConnected;

      vocations = vocations.filter(vocation => {
        return vocation.set;
      });

      formats = formats.filter(format => {
        return format.set;
      });

      const vocationSelected = vocations.length > 0,
        formatSelected = formats.length > 0;

      let i = 0;
      let vocationStr = "";

      if (vocationSelected) {
        for (i; i < vocations.length; i++) {
          const vocation = vocations[i];
          vocationStr += `${vocation.name}, `;
        }
        vocationStr = vocationStr.substring(0, vocationStr.length - 2);
      }

      let formatStr = "";
      formats.forEach(format => {
        formatStr += `${format.name}, `;
      });
      formatStr = formatStr.substring(0, formatStr.length - 2);

      content = (
        <React.Fragment>
          <Helmet>
            <title>{`Scrim TV: ${displayName}'s profile`}</title>
            <meta
              name="description"
              content={`${displayName} is a ${vocationStr}, 
              Follower Count: ${followerCount},
              Tagline: ${tagline}`}
            />
          </Helmet>
          {/* <ProfileHeaderBackground /> */}
          <ProfileHeaderContainer>
            <UserHeaderInfo>
              <UserImage src={imageUrl} />
              <UserTextContainer>
                <UserTextInnerContainer>
                  <DisplayName>{displayName}</DisplayName>
                  {vocationSelected && <Vocations>{showFullVocations ? vocationStrFull : vocationStr}</Vocations>}
                  <Connections>
                    <FollowerCount>
                      {formatInt(followerCount, false)}
                      &nbsp;
                      {Copy.connections}
                      &nbsp;|&nbsp;
                      {Copy.following}
                      &nbsp;
                      {formatInt(followingCount, false)}
                    </FollowerCount>
                    {isConnected ? (
                      <ConnectButton onClick={this.messageUser}>{Copy.message}</ConnectButton>
                    ) : (
                      <ConnectButton onClick={this.connectUser}>{Copy.connect}</ConnectButton>
                    )}
                  </Connections>
                </UserTextInnerContainer>
              </UserTextContainer>
            </UserHeaderInfo>
          </ProfileHeaderContainer>

          <ProfileInfoContainer>
            <TaglineContainer>
              <ProfileTextContainer>
                {tagline ? <TaglineText>{tagline}</TaglineText> : <TaglinePrompt>{Copy.emptyText}</TaglinePrompt>}
              </ProfileTextContainer>
            </TaglineContainer>

            <NonCenteredInfoContainer>
              <AboutContainer>
                <AboutTitle>{Copy.about}</AboutTitle>
                <Underline />
                <ProfileTextContainer>
                  {about ? (
                    <ProfileText full={showFullAbout}>{about}</ProfileText>
                  ) : (
                    <ProfilePrompt>{Copy.emptyText}</ProfilePrompt>
                  )}
                  {showFullAbout && (
                    <React.Fragment>
                      <AboutTitle>{Copy.interestedIn}</AboutTitle>
                      <Formats>{formatStr}</Formats>
                    </React.Fragment>
                  )}
                  {!showFullAbout && <ViewMoreButton onClick={this.showAbout}>{Copy.viewMore}</ViewMoreButton>}
                </ProfileTextContainer>
              </AboutContainer>
            </NonCenteredInfoContainer>
          </ProfileInfoContainer>

          <SectionTitleContainer>
            <SectionTitleTextContainer>
              <SectionTitle>{`${displayName}'s ${Copy.reel}`}</SectionTitle>
              <SectionSubText>{Copy.reelSubText}</SectionSubText>
            </SectionTitleTextContainer>
          </SectionTitleContainer>
          <ListContainer>
            <SectionList type="Broadcast">
              {broadcasts &&
                broadcasts.map((broadcast, index) => {
                  const last = index === broadcasts.length - 1;
                  return this.getBroadcast(broadcast, last);
                })}
            </SectionList>
          </ListContainer>
          <ListContainer>
            <SectionList type="Paper">
              {papers &&
                papers.map((paper, index) => {
                  const last = index === papers.length - 1;
                  return this.getPaper(paper, last);
                })}
            </SectionList>
          </ListContainer>
        </React.Fragment>
      );
    } else {
      console.error("Error getting user");
    }

    return (
      <React.Fragment>
        <Header title={Copy.userProfile} />
        {content}
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(User);
