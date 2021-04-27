import React from "react";
import { Helmet } from "react-helmet";
import styled, { css } from "styled-components";
import { Screen, HeaderPadding, FooterPadding } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";
import {
  ListContainer,
  SectionList,
  SectionTitleContainer,
  SectionTitleTextContainer,
  SectionTitle,
  SectionSubText
} from "../Home/Home";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import Copy from "../../global/locales/en_us";
import ProjectItem from "../../components/ProjectItem";
import BroadcastSkeleton from "../../components/LoadingScreens/BroadcastSkeleton";
import MediaQuery from "react-responsive";

const ContentContainer = styled.ul`
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow: ${props => (props.fetching === true ? "visible" : "scroll")};
`;

const ProjectContainer = styled.li`
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

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { fetchProjectsData } = this.props;
    fetchProjectsData();
  }

  componentWillUnmount() {}

  componentDidUpdate() {}

  getSectionTitle = (title, subText) => {
    return (
      <SectionTitleContainer key={title} className="sectionTitle">
        <SectionTitleTextContainer>
          <SectionTitle>{title}</SectionTitle>
          {subText && <SectionSubText>{subText}</SectionSubText>}
        </SectionTitleTextContainer>
      </SectionTitleContainer>
    );
  };

  getProject = project => {
    return (
      <ProjectContainer key={project.id}>
        <ProjectItem {...project} />
      </ProjectContainer>
    );
  };

  render() {
    const { fetching, data } = this.props;
    let content;

    if (fetching) {
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
                    case "Project":
                      return this.getProject(item);
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
          <title>Scrim TV: Be an executive producer</title>
          <meta name="description" content="Help the world's greatest creators bring their vision to life." />
        </Helmet>

        <Header title={Copy.projects} />

        <MediaQuery query={Screen.smallQuery}>
          {matches =>
            matches ? (
              <React.Fragment>
                {!fetching && <HeaderPadding />}
                <ContentContainer fetching={fetching}>{content}</ContentContainer>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <HeaderPadding />
                <ContentContainer>{content}</ContentContainer>
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

export default Projects;
