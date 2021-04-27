import React, { Component } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import queryString from "query-string";
import { Text, SubText, HeaderPadding, Screen } from "../../global/styles/styles";
import Copy from "../../global/locales/en_us";
import Colors from "../../global/styles/colors";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import { formatMoney } from "../../global/utils/utils";

const ProjectPageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ProjectContainer = styled.div`
  width: 100%;
  max-width: 700px;
  padding: 12px;
`;

const ProjectTitle = styled(Text)`
  padding-top: 18px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const Tag = styled(SubText)`
  font-weight: 600;
  color: ${Colors.scrimBlue};
  font-size: 14px;
`;

const LoglineContainer = styled.div`
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
`;

const ProjectImg = styled.img`
  width: 50%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;

  @media ${Screen.tinyQuery} {
    width: 100%;
  }

  @media ${Screen.smallQuery} {
    width: 100%;
  }
`;

const Logline = styled(Text)`
  padding-top: 12px;
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 1.5;
  padding-left: 12px;
  width: 50%;

  @media ${Screen.tinyQuery} {
    padding-left: 0px;
    width: 100%;
  }

  @media ${Screen.smallQuery} {
    padding-left: 0px;
    width: 100%;
  }
`;

const DescriptionContainer = styled.div`
  padding-top: 21px;
`;

const HeaderText = styled(Text)`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const HeaderUnderline = styled.div`
  height: 1px;
  background: ${Colors.darkSubText};
  width: 46px;
  margin-top: 4px;
  width: ${props => `${props.width}px`};
`;

const Format = styled(Text)`
  padding-top: 12px;
  font-weight: 600;
  font-size: 16px;
`;

const Length = styled(Format)`
  padding-top: 4px;
`;

const Description = styled(Text)`
  padding-top: 8px;
  font-size: 16px;
  line-height: 1.75;
`;

const FundingContainer = styled.div`
  margin-top: 21px;
`;

const FundingInfoContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  padding-top: 18px;
  padding-bottom: 12px;
  border-radius: 8px;
  background-color: ${Colors.skeletonLighter};
`;

const FundingBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FundingBarAndLegendContainer = styled.div``;

const FundingBar = styled.div`
  width: 300px;
  height: 18px;
  background: ${Colors.skeletonDark};
  border-radius: 4px;
  display: flex;
`;

const FanFiller = styled.div`
  height: 100%;
  background: ${props => props.color};
  width: ${props => `${props.width}%`};
  border-radius: 4px 0px 0px 4px;
`;

const InvestorFiller = styled(FanFiller)`
  border-radius: ${props => (props.corner ? "4px 0px 0px 4px" : "0px")};
`;

const ExecutiveProducerFiller = styled(FanFiller)`
  border-radius: ${props => (props.corner ? "4px 4px 4px 4px" : "0px 4px 4px 0px")};
`;

const FundingLegendContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const FundingLegendItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 8px;
`;

const FundingLegendColor = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.color};
`;

const FundingLegendTitle = styled(Text)`
  padding-left: 4px;
`;

const FundingAmountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px;
`;

const AmountRaised = styled(Text)`
  font-weight: 700;
  font-size: 18px;
`;

const AmountDivider = styled(SubText)`
  font-weight: 700;
  font-size: 14px;
  padding-left: 6px;
  padding-right: 6px;
  text-transform: uppercase;
`;

const TargetAmount = styled(Text)`
  font-weight: 700;
  font-size: 18px;
`;

const BackersContainer = styled.div`
  padding-top: 4px;
  display: flex;
  justify-content: center;
`;

const BackersText = styled(Text)`
  font-size: 16px;
  text-align: center;
  display: flex;
`;

const BackersCount = styled.span`
  font-weight: 600;
  padding-right: 4px;
`;

const ToneContainer = styled(DescriptionContainer)``;

const Tone = styled(Format)``;

const LookImg = styled.img`
  width: 330px;
  height: 330px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
  max-width: 100%;
`;

const ScriptSample = styled(Description)`
  padding-top: 12px;
  margin-left: 18px;
  margin-right: 18px;
  font-family: "Courier";
`;

const CreatorsOuterContainer = styled(DescriptionContainer)``;

const CreatorsContainer = styled.div`
  padding-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media ${Screen.tinyQuery} {
    justify-content: center;
  }

  @media ${Screen.smallQuery} {
    justify-content: center;
  }
`;

const CreatorItem = styled.div`
  max-width: 320px;
  padding-bottom: 12px;
`;

const CreatorImg = styled.img`
  width: 320px;
  height: 240px;
  object-fit: cover;
  border-radius: 4px;
  max-width: 100%;
`;

const CreatorName = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const CreatorDescription = styled(Text)`
  padding-top: 2px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 22px;
  max-height: 66px;
`;

class Project extends Component {
  constructor(props) {
    super(props);

    const { projectId } = queryString.parse(this.props.location.search);

    this.state = {
      projectId: projectId
    };
  }

  componentDidMount() {
    const { fetchProjectData } = this.props;
    fetchProjectData(this.state.projectId);
  }

  creatorItem = creator => {
    const { id, displayName, imageUrl, description } = creator;
    return (
      <CreatorItem key={id}>
        <CreatorImg src={imageUrl} />
        <CreatorName>{displayName}</CreatorName>
        <CreatorDescription>{description}</CreatorDescription>
      </CreatorItem>
    );
  };

  render() {
    let pageContent;
    let { project } = this.props.location;
    const { fetching } = this.props;

    if (!project) {
      project = this.props.data;
    }

    if (fetching) {
    } else if (project) {
      const {
        title,
        tag,
        imageUrl,
        logline,
        format,
        length,
        description,
        tone,
        look,
        scriptSample,
        leadCreator,
        raisedAmount,
        targetAmount,
        fanInfo,
        investorInfo,
        executiveProducerInfo,
        creators
      } = project;

      const raisedDollars = formatMoney(raisedAmount);
      const targetDollars = formatMoney(targetAmount);

      const fanPercentageRaised = (fanInfo.amountRaised * 100) / targetAmount;
      const investorPercentageRaised = (investorInfo.amountRaised * 100) / targetAmount;
      const execProducerPercentageRaised = (executiveProducerInfo.amountRaised * 100) / targetAmount;

      const fanColor = Colors.subscribedText;
      const investorColor = Colors.presentsAccent;
      const execProducerColor = Colors.darkBlue;

      const backers = fanInfo.pledgeCount + investorInfo.pledgeCount + executiveProducerInfo.pledgeCount;

      console.log(project);
      pageContent = (
        <ProjectPageContainer>
          <Helmet>
            <title>{`Scrim TV: ${title} by ${leadCreator.displayName}`}</title>
            <meta
              name="description"
              content={`${title} by ${leadCreator.displayName}, 
              Raised: ${raisedDollars} out of ${targetDollars}`}
            />
          </Helmet>
          <ProjectContainer>
            <ProjectTitle>{title}</ProjectTitle>
            <Tag>{tag}</Tag>
            <LoglineContainer>
              <ProjectImg src={imageUrl} />
              <Logline>{logline}</Logline>
            </LoglineContainer>
            <FundingContainer>
              <HeaderText>{Copy.funding}</HeaderText>
              <HeaderUnderline width={52} />
              <FundingInfoContainer>
                <FundingBarContainer>
                  <FundingBarAndLegendContainer>
                    <FundingBar>
                      <FanFiller width={fanPercentageRaised} color={fanColor} />
                      <InvestorFiller
                        width={investorPercentageRaised}
                        color={investorColor}
                        corner={fanPercentageRaised < 2}
                      />
                      <ExecutiveProducerFiller
                        width={execProducerPercentageRaised}
                        color={execProducerColor}
                        corner={fanPercentageRaised + investorPercentageRaised < 2}
                      />
                    </FundingBar>
                    <FundingLegendContainer>
                      <FundingLegendItemContainer>
                        <FundingLegendColor color={fanColor} />
                        <FundingLegendTitle>{Copy.fans}</FundingLegendTitle>
                      </FundingLegendItemContainer>
                      <FundingLegendItemContainer>
                        <FundingLegendColor color={investorColor} />
                        <FundingLegendTitle>{Copy.investors}</FundingLegendTitle>
                      </FundingLegendItemContainer>
                      <FundingLegendItemContainer>
                        <FundingLegendColor color={execProducerColor} />
                        <FundingLegendTitle>{Copy.executiveProducers}</FundingLegendTitle>
                      </FundingLegendItemContainer>
                    </FundingLegendContainer>
                    <FundingAmountContainer>
                      <AmountRaised>{raisedDollars}</AmountRaised>
                      <AmountDivider>{Copy.of}</AmountDivider>
                      <TargetAmount>{targetDollars}</TargetAmount>
                    </FundingAmountContainer>
                    <BackersContainer>
                      <BackersText>
                        <BackersCount>{backers}</BackersCount>
                        {backers === 1 ? Copy.backer : Copy.backers}
                      </BackersText>
                    </BackersContainer>
                  </FundingBarAndLegendContainer>
                </FundingBarContainer>
              </FundingInfoContainer>
            </FundingContainer>
            <ToneContainer>
              <HeaderText>{Copy.tone}</HeaderText>
              <HeaderUnderline width={106} />
              <Tone>{tone}</Tone>
              <CreatorsContainer>
                {look.map(image => (
                  <LookImg src={image} />
                ))}
              </CreatorsContainer>
            </ToneContainer>
            <DescriptionContainer>
              <HeaderText>{Copy.description}</HeaderText>
              <HeaderUnderline width={62} />
              <Format>{`${format} • ${length}`}</Format>
              {/* <Length>{length}</Length> */}
              <Description>{description}</Description>
            </DescriptionContainer>
            <ToneContainer>
              <HeaderText>{Copy.scriptSample}</HeaderText>
              <HeaderUnderline width={100} />
              <ScriptSample
                dangerouslySetInnerHTML={{
                  __html: scriptSample
                }}
              />
            </ToneContainer>
            <CreatorsOuterContainer>
              <HeaderText>{Copy.creators}</HeaderText>
              <HeaderUnderline width={66} />
              <CreatorsContainer>{creators.map(creator => this.creatorItem(creator))}</CreatorsContainer>
            </CreatorsOuterContainer>
          </ProjectContainer>
        </ProjectPageContainer>
      );
    } else {
    }

    return (
      <React.Fragment>
        <Header title={Copy.presenting} />
        <HeaderPadding />
        {pageContent}
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Project;
