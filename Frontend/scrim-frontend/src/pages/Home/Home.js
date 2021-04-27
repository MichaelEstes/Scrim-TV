import React from "react";
import { Helmet } from "react-helmet";
import styled, { css } from "styled-components";
import { Text, Screen, HeaderPadding, FooterPadding, Button, Link } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import Copy from "../../global/locales/en_us";
import { isUserLoggedIn } from "../../global/utils/auth";
import Broadcast from "../../components/Broadcast";
import Paper from "../../components/Paper";
import BroadcastSkeleton from "../../components/LoadingScreens/BroadcastSkeleton";
import MediaQuery from "react-responsive";

const ContentContainer = styled.ul`
  margin: 0;
  padding: 0;
  overflow: ${props => (props.fetching === true ? "visible" : "scroll")};
`;

const BannerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 210px;
  background-color: #5255ad;
  align-items: center;
`;

const BannerTextContainer = styled.div`
  padding-left: 12px;

  @media ${Screen.largeQuery} {
    padding-left: 52px;
  }

  @media ${Screen.mediumQuery} {
    padding-left: 32px;
  }
`;

const BannerTitle = styled(Text)`
  font-weight: 700;
  color: #fff;
  font-size: 32px;
  letter-spacing: 2.5px;
`;

const BannerSubText = styled(BannerTitle)`
  font-weight: 400;
  font-size: 24px;
  letter-spacing: 1px;
`;

const BannerButtonContainer = styled.div`
  padding-top: 12px;
`;

const BannerCreateAccountButton = styled(Button)`
  background-color: #ffffff00;
  color: ${Colors.lightText};
  border: solid ${Colors.lightText} 2px;
  width: 172px !important;
  height: 38px !important;
  padding: 0px !important;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5;
  border-radius: 4px;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
  align-self: center;
  justify-self: center;
  cursor: pointer;
`;

export const SectionTitleContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 6px;

  @media ${Screen.largeQuery} {
    display: grid;
    justify-content: center;
    padding-top: 24px;
    padding-bottom: 0px;
  }
`;

export const SectionTitleTextContainer = styled.div`
  width: 1120px;
  max-width: 100%;

  @media ${Screen.mediumQuery} {
    padding-left: 8px;
  }
`;

export const SectionTitle = styled(Text)`
  color: ${Colors.sectionTitle};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.8px;
  padding-left: 6px;
  padding-top: 6px;
  text-transform: uppercase;

  @media ${Screen.smallQuery} {
    font-size: 16px;
    padding-left: 10px;
  }
`;

export const SectionSubText = styled(Text)`
  font-size: 16px;
  padding-left: 6px;

  @media ${Screen.smallQuery} {
    padding-left: 10px;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  @media ${Screen.mediumQuery} {
    justify-content: flex-start;
  }
`;

export const SectionList = styled.ul`
  display: grid;
  padding: 0px;

  @media ${Screen.largeQuery} {
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    padding-top: 10px;
  }

  @media ${Screen.mediumQuery} {
    display: flex;
    padding-top: 10px;
    padding-left: 12px;
    overflow: scroll;
  }

  ${props =>
    props.type === "Broadcasters"
      ? css`
          display: flex;
          white-space: nowrap;
          overflow-x: scroll;
          width: 100vw;
        `
      : null};
`;

export const BroadcastContainer = styled.li`
  display: flex;
  justify-content: center;
  padding: 8px 10px;

  @media ${Screen.smallQuery} {
    width: 100vw;
    padding-left: 0px;
    padding-right: 0px;
    border-bottom: 1px solid ${Colors.border};
  }
`;

class Home extends React.Component {
  constructor(props) {
    super(props);

    const showIntitialBanner = props.location.pathname === "/";

    this.state = {
      currentSectionTitle: "",
      currentSectionIndex: 0,
      showIntitialBanner: showIntitialBanner
    };
  }

  componentDidMount() {
    const { fetchHomeData } = this.props;
    fetchHomeData();
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  componentDidUpdate() {
    if (!this.state.currentSectionTitle && !this.props.fetching) {
      this.setState({
        currentSectionTitle: this.props.data[0].name
      });
    }
  }

  onScroll = () => {
    const sectionTitles = document.getElementsByClassName("sectionTitle");
    for (var i = 0; i < sectionTitles.length; i++) {
      const sectionTitle = sectionTitles[i].getElementsByTagName("P")[0].innerHTML;
      const sectionTitleTop = sectionTitles[i].getBoundingClientRect().top;
      if (sectionTitleTop < 24 && this.state.currentSectionTitle !== sectionTitle) {
        this.setState({
          currentSectionTitle: sectionTitle
        });
      }
    }
  };

  getSectionTitle = (title, subText, isFirst) => {
    return (
      <SectionTitleContainer key={title} className="sectionTitle">
        <SectionTitleTextContainer>
          <SectionTitle>{title}</SectionTitle>
          {subText && <SectionSubText>{subText}</SectionSubText>}
        </SectionTitleTextContainer>
      </SectionTitleContainer>
    );
  };

  getBroadcast = broadcast => {
    return (
      <BroadcastContainer key={broadcast.id}>
        <Broadcast {...broadcast} />
      </BroadcastContainer>
    );
  };

  getPaper = paper => {
    return (
      <BroadcastContainer key={paper.id}>
        <Paper {...paper} />
      </BroadcastContainer>
    );
  };

  getInitBanner = () => {
    return (
      <BannerContainer>
        <BannerTextContainer>
          <BannerTitle>{Copy.bannerTitle}</BannerTitle>
          <BannerSubText>{Copy.bannerSubtext}</BannerSubText>
          <BannerButtonContainer>
            <Link to={{ pathname: "/register" }}>
              <BannerCreateAccountButton>{Copy.createAccount}</BannerCreateAccountButton>
            </Link>
          </BannerButtonContainer>
        </BannerTextContainer>
      </BannerContainer>
    );
  };

  render() {
    const { currentSectionTitle, showIntitialBanner } = this.state;
    const { fetching, data } = this.props;
    let content;

    if (fetching) {
      content = <BroadcastSkeleton />;
    } else if (data && data.length > 0) {
      content = [];

      this.props.data.map((section, index) => {
        content.push(this.getSectionTitle(section.name, section.subText));
        content.push(
          <ListContainer key={`${section.name}-container`}>
            <SectionList type={section.type}>
              {section.data &&
                section.data.map(item => {
                  switch (section.type) {
                    case "Broadcast":
                      return this.getBroadcast(item);
                    case "Paper":
                      return this.getPaper(item);
                  }
                })}
            </SectionList>
          </ListContainer>
        );
      });
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Scrim TV: Trending videos and stories</title>
          <meta
            name="description"
            content="Watch and read great shorts, movies, scripts and more from the best indie creators"
          />
        </Helmet>

        <Header title={Copy.trending} />

        <MediaQuery query={Screen.smallQuery}>
          {matches =>
            matches ? (
              <React.Fragment>
                {!fetching && <HeaderPadding />}
                <ContentContainer fetching={fetching}>
                  {showIntitialBanner && !isUserLoggedIn() && this.getInitBanner()}
                  {content}
                </ContentContainer>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <HeaderPadding />
                <ContentContainer>
                  {showIntitialBanner && !isUserLoggedIn() && this.getInitBanner()}
                  {content}
                </ContentContainer>
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

export default Home;
