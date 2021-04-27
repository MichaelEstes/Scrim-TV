import React, { Component } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import queryString from "query-string";
import {
  Text,
  SubText,
  ContentText,
  ContentFirstLetter,
  ContentFirstWord,
  HeaderPadding,
  FooterPadding,
  Screen
} from "../../global/styles/styles";
import Copy from "../../global/locales/en_us";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import { formatInt } from "../../global/utils/utils";
import Creator from "../../components/Creator";

const PaperPageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const PaperContainer = styled.div`
  width: 100%;
  max-width: 700px;
`;

const PaperPadding = styled.div`
  padding-top: 38px;

  @media ${Screen.smallQuery} {
    padding-top: 12px;
  }

  @media ${Screen.tinyQuery} {
    padding-top: 12px;
  }
`;

const PaperInfoContainer = styled.div`
  @media ${Screen.smallQuery} {
    padding-left: 12px;
  }

  @media ${Screen.tinyQuery} {
    padding-left: 12px;
  }
`;

const Title = styled(Text)`
  font-size: 18px;
  line-height: 20px;
  min-height: 22px;
  max-width: 75%;
  font-weight: 600;
  padding-top: 12px;
`;

const ViewerContainer = styled.div`
  display: flex;
`;

const Viewers = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  align-self: center;
`;

const ViewersText = styled(Text)`
  font-size: 13px;
  font-weight: 600;
  padding-top: 1px;
  padding-right: 4px;
  letter-spacing: 0.5px;
  align-self: center;
`;

const AirTime = styled(SubText)`
  font-size: 13px;
  padding-top: 2px;
  padding-left: 4px;
`;

const ContentContainer = styled(ContentText)`
  line-height: 1.2em;
  margin-bottom: 3px;
  padding-top: 42px;

  @media ${Screen.smallQuery} {
    padding: 24px 12px;
  }

  @media ${Screen.tinyQuery} {
    padding: 24px 12px;
  }
`;

const ContentLine = styled.span`
  padding-bottom: 12px;
`;

class Read extends Component {
  constructor(props) {
    super(props);

    const { paperId } = queryString.parse(this.props.location.search);

    this.state = {
      paperId: paperId
    };
  }

  componentDidMount() {
    const { fetchPaperData } = this.props;
    fetchPaperData(this.state.paperId);
    this.paperViewed();
  }

  paperViewed = () => {
    //updateViewCount(this.state.broadcastId).then(res => {});
  };

  shareClicked = () => {
    console.log(`Sharing: ${this.state.paperId}`);
  };

  render() {
    let pageContent;
    let { paper } = this.props.location;
    const { fetching } = this.props;

    if (!paper) {
      paper = this.props.paper;
    }

    if (fetching) {
    } else if (paper) {
      const { creator, title, content, viewerCount, publishedTime } = paper;

      var i = 0;
      for (i; i < content.length; i++) {
        if (content.charAt(i) === " ") {
          break;
        }
      }

      const contentFirstLetter = content.substring(0, 1);
      const contentFirstWord = content.substring(1, i);
      const contentLines = content.substring(i, content.length - 1).split("\n");
      const wordCount = content.split(" ").length;

      pageContent = (
        <PaperPageContainer>
          <Helmet>
            <title>{`Scrim TV: Read ${title} by ${creator.displayName}`}</title>
            <meta
              name="description"
              content={`${title} by ${creator.displayName}, 
              Length: ${wordCount} words,
              Published: ${publishedTime},
              Viewed: ${viewerCount} times`}
            />
          </Helmet>
          <PaperContainer>
            <PaperPadding />
            <PaperInfoContainer>
              <Creator type="Paper" {...creator} />
              <Title>{title}</Title>
              <ViewerContainer>
                <Viewers>{formatInt(viewerCount)}</Viewers>
                <ViewersText>
                  &nbsp;
                  {Copy.views}
                </ViewersText>
                &nbsp;·&nbsp;
                <AirTime>{`${Copy.published} ${publishedTime}`}</AirTime>
              </ViewerContainer>
            </PaperInfoContainer>
            <ContentContainer>
              <ContentFirstLetter>{contentFirstLetter}</ContentFirstLetter>
              <ContentFirstWord>{contentFirstWord}</ContentFirstWord>
              &nbsp;
              <ContentLine>{contentLines[0]}</ContentLine>
              {contentLines.map((text, key) => {
                if (key > 0) {
                  return (
                    <ContentLine key={key}>
                      <br />
                      {text}
                    </ContentLine>
                  );
                }
              })}
            </ContentContainer>
          </PaperContainer>
        </PaperPageContainer>
      );
    } else {
    }

    return (
      <React.Fragment>
        <Header title={Copy.nowReading} />
        <HeaderPadding />
        {pageContent}
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Read;
