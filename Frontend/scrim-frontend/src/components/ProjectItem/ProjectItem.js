import React from "react";
import { Text, SubText, Screen, Link } from "../../global/styles/styles";
import { getPercentage } from "../../global/utils/utils";
import Copy from "../../global/locales/en_us";
import Colors from "../../global/styles/colors";
import styled from "styled-components";
import Creator from "../Creator";

const ProjectContainer = styled.div`
  width: 100vw;
  max-width: 356px;
  display: grid;
  cursor: pointer;
`;

const TopRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProjectTitle = styled(Text)`
  padding-top: 6px;
  padding-right: 6px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;

  @media ${Screen.largeQuery} {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  @media ${Screen.mediumQuery} {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const ProjectImgContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-top: 8px;
  border-radius: 8px;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
`;

const ProjectImg = styled.img`
  width: 356px;
  height: 356px;
  transition: 0.3s ease;
`;

const ProjectContentContainer = styled.div`
  &:hover ${ProjectImg} {
    transform: scale(1.1);
  }
`;

const TagPillContainer = styled.div`
  align-self: flex-end;
`;

const TagPill = styled.div`
  background: ${Colors.scrimBlue};
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 12px;
`;

const TagText = styled(Text)`
  color: ${Colors.lightText};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.5px;
  padding-top: 1px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DescriptionText = styled(Text)`
  padding-top: 4px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 18px;
  max-height: 60px;
`;

const RaisedText = styled(Text)`
  padding-top: 4px;
  font-size: 12px;
  color: ${Colors.subscribedText};
  text-transform: uppercase;
  font-weight: 700;
`;

const DeadlineText = styled(SubText)`
  font-size: 12px;
  padding-top: 4px;
`;

const ProjectItem = props => {
  const {
    id,
    leadCreator,
    title,
    imageUrl,
    logline,
    tag,
    raisedAmount,
    targetAmount,
    backers,
    productionStartDate
  } = props;

  const fundedPercent = getPercentage(raisedAmount, targetAmount);
  return (
    <ProjectContainer>
      <TopRowContainer>
        <Creator type="Broadcast" {...leadCreator} />
      </TopRowContainer>
      <Link to={{ pathname: "/project", search: `?projectId=${id}`, project: { ...props } }}>
        <ProjectContentContainer>
          <ProjectImgContainer>
            <ProjectImg src={imageUrl} />
          </ProjectImgContainer>
          <TitleContainer>
            <ProjectTitle>{title}</ProjectTitle>
            <TagPillContainer>
              <TagPill>
                <TagText>{tag}</TagText>
              </TagPill>
            </TagPillContainer>
          </TitleContainer>
          <RaisedText>{`${fundedPercent}% ${Copy.funded} • ${backers} ${
            backers === 1 ? Copy.backer : Copy.backers
          }`}</RaisedText>
          <DescriptionText>{logline}</DescriptionText>
          <DeadlineText>{`${Copy.deadline} ${productionStartDate}`}</DeadlineText>
          {/* <RaisedText>{`${Copy.raised} ${formatMoney(raisedAmount)} of ${formatMoney(targetAmount)}`}</RaisedText> */}
        </ProjectContentContainer>
      </Link>
    </ProjectContainer>
  );
};

export default ProjectItem;
