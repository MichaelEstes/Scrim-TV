import React from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import styled, { css } from "styled-components";
import { Text, Screen, HeaderPadding, FooterPadding, Link, Button } from "../../global/styles/styles";
import CompanyFooter from "../../components/CompanyFooter";
import Colors from "../../global/styles/colors";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Copy from "../../global/locales/en_us";
import { formatInt } from "../../global/utils/utils";
import InfiniteScroll from "react-infinite-scroller";
import { getRecommendedUsersPaginated } from "../../global/api/endpoints";

const ContentContainer = styled.ul`
  margin: 0;
  padding: 0;
  overflow: ${props => (props.fetching === true ? "visible" : "scroll")};
`;

const SectionTitleContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 6px;

  @media ${Screen.largeQuery} {
    display: grid;
    justify-content: center;
    padding-top: 24px;
    padding-bottom: 0px;
  }
`;

const SectionTitleTextContainer = styled.div`
  width: 1120px;
  max-width: 100%;

  @media ${Screen.mediumQuery} {
    padding-left: 8px;
  }
`;

const SectionTitle = styled(Text)`
  color: ${Colors.sectionTitle};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.8px;
  padding-left: 6px;
  padding-top: 6px;

  @media ${Screen.smallQuery} {
    font-size: 16px;
    padding-left: 10px;
    border-top: 1px solid ${Colors.border};
  }
`;

const SectionSubText = styled(Text)`
  font-size: 16px;
  padding-left: 6px;

  @media ${Screen.smallQuery} {
    padding-left: 10px;
  }
`;

const NoUsersText = styled(Text)`
  color: ${Colors.darkSubText};
  font-size: 18px;
  padding: 24px 14px;
  width: 260px;
`;

const ListContainer = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;

  @media ${Screen.mediumQuery} {
    justify-content: flex-start;
  }
`;

const SectionList = styled.ul`
  padding: 0px;
  display: flex;
  padding-top: 10px;
  padding-left: 12px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  @media ${Screen.largeQuery} {
    display: inline-grid;
    grid-template-columns: repeat(4, 1fr);
    padding-left: 0px;
  }

  @media ${Screen.mediumQuery} {
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    padding-left: 0px;
    min-width: 100vw;
  }

  @media ${Screen.smallQuery} {
    min-width: 100vw;
    ${props =>
      props.type
        ? css`
            display: inline-grid;
            grid-template-columns: repeat(1, 1fr);
            justify-items: center;
            padding-left: 0px;
          `
        : null};
  }

  @media ${Screen.tinyQuery} {
    min-width: 100vw;
    ${props =>
      props.type
        ? css`
            display: inline-grid;
            grid-template-columns: repeat(1, 1fr);
            justify-items: center;
            padding-left: 0px;
          `
        : null};
  }
`;

const CreatorImageContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  overflow: hidden;
  height: 120px;
  border-radius: 2px;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
`;

const CreatorImage = styled.img`
  width: 240px;
  height: 120px;
  object-fit: cover;
  transition: 0.3s ease;
  content: ${props => (props.src ? props.src : "linear-gradient(-225deg, #ff3cac 0%, #784ba0 51%, #2b86c5 100%)")};
`;

const CreatorTextContainer = styled.div``;

const CreatorName = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  padding-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const Vocations = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${Colors.presentsAccent};
  padding-top: 6px;
`;

const Connections = styled.div`
  display: flex;
  padding-top: 2px;
`;

const FollowerCount = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  color: ${Colors.darkSubText};
`;

const FollowerLabel = styled(FollowerCount)``;

const CreatorContainer = styled.div`
  display: grid;
  width: 240px;
  margin: 8px;

  &:hover ${CreatorImage} {
    transform: scale(1.1);
  }
`;

const ViewMoreContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
  padding-top: 8px;
`;

const ViewMoreButton = styled(Button)`
  color: ${Colors.scrimBlue};
  font-weight: 700;
  font-size: 14px;
  background: rgba(0, 0, 0, 0);
  text-transform: uppercase;
`;

class Connect extends React.Component {
  constructor(props) {
    super(props);

    const { type = "" } = props.match.params;

    this.state = {
      data: [],
      type: type,
      loadMore: type !== ""
    };
  }

  componentDidMount() {
    this.getConnectData();
  }

  componentWillUnmount() {}

  componentDidUpdate() {
    if (this.props.data) {
      const { data } = this.props;
      if (this.state.data !== data) {
        this.setState({
          data: data
        });
      }
    }

    const { type = "" } = this.props.match.params;
    if (type !== this.state.type) {
      this.getConnectData();
      this.setState({
        type: type,
        loadMore: type !== ""
      });
    }
  }

  getConnectData = () => {
    const { type = "" } = this.props.match.params;
    const { fetchConnectData } = this.props;
    fetchConnectData(type);
  };

  getSectionTitle = (title, subText) => {
    return (
      <SectionTitleContainer key={title} className="sectionTitle">
        <SectionTitleTextContainer>
          <SectionTitle>{title.toUpperCase()}</SectionTitle>
          {subText && <SectionSubText>{subText}</SectionSubText>}
        </SectionTitleTextContainer>
      </SectionTitleContainer>
    );
  };

  getCreator(user, vocation, index) {
    const { id, displayName, followerCount, imageUrl } = user;
    let { vocations } = user;
    vocations = vocations.filter(vocation => {
      return vocation.set;
    });

    let vocationsStr = "";

    if (vocations.length > 0) {
      vocationsStr = vocation == "connection" ? vocations[0].name : vocation;
    } else {
      vocationsStr = "connection";
    }

    if (vocations.length > 1) {
      vocationsStr += ` +${vocations.length - 1} more`;
    }

    return (
      <Link to={{ pathname: "/user/" + id }} key={user.id + vocation + index}>
        <CreatorContainer>
          <CreatorImageContainer>
            <CreatorImage src={imageUrl} />
          </CreatorImageContainer>
          <CreatorTextContainer>
            <Vocations>{vocationsStr}</Vocations>
            <CreatorName>{displayName}</CreatorName>
            <Connections>
              <FollowerCount>{formatInt(followerCount, false)}</FollowerCount>
              <FollowerLabel>
                &nbsp;
                {Copy.connections}
              </FollowerLabel>
            </Connections>
          </CreatorTextContainer>
        </CreatorContainer>
      </Link>
    );
  }

  viewMoreClicked = vocation => {
    this.props.history.push(`/connect/${vocation}`);
  };

  loadMoreUsers = page => {
    const { type = "" } = this.props.match.params;
    const users = this.state.data[0].users;

    if (type) {
      getRecommendedUsersPaginated(type, page).then(res => {
        if (res.data) {
          users.push.apply(users, res.data);
          this.setState({
            data: this.state.data
          });
        } else {
          this.setState({
            loadMore: false
          });
        }
      });
    }
  };

  render() {
    const { type = "" } = this.props.match.params;
    const { fetching } = this.props;
    const { data, loadMore } = this.state;

    let content;
    if (fetching) {
    } else if (data) {
      content = (
        <React.Fragment>
          {data.map((connectData, i) => {
            return (
              <React.Fragment key={i}>
                {this.getSectionTitle(connectData.name, connectData.subText)}
                <InfiniteScroll pageStart={0} loadMore={this.loadMoreUsers} hasMore={loadMore}>
                  <ListContainer>
                    <SectionList type={type}>
                      {connectData.users ? (
                        connectData.users.map((user, ix) => {
                          return this.getCreator(user, connectData.type, ix);
                        })
                      ) : (
                        <NoUsersText>
                          {connectData.type === "connection" ? Copy.noConnections : Copy.noUsers}
                        </NoUsersText>
                      )}
                    </SectionList>
                    {connectData.users &&
                      !type && (
                        <ViewMoreContainer>
                          <ViewMoreButton onClick={() => this.viewMoreClicked(connectData.type)}>
                            {Copy.viewMore}
                          </ViewMoreButton>
                        </ViewMoreContainer>
                      )}
                  </ListContainer>
                </InfiniteScroll>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    } else {
    }

    const title = type ? type + "s" : Copy.connect;
    return (
      <React.Fragment>
        <Helmet>
          <title>Scrim TV: Connect with other content creators</title>
          <meta name="description" content="Find and connect with directors, actors, producers and other creators" />
        </Helmet>
        <Header title={title} />
        <HeaderPadding />
        <ContentContainer>{content}</ContentContainer>
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(Connect);
