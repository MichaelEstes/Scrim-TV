import React from "react";
import styled from "styled-components";
import { Text, Screen } from "../../../global/styles/styles";
import { formatInt } from "../../../global/utils/utils";
import Copy from "../../../global/locales/en_us";

const SimilarCreatorsContainer = styled.div`
  padding-top: 12px;

  @media ${Screen.largeQuery} {
    max-width: 544px;
  }
`;

const SimilarCreatorsTitle = styled(Text)`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(72, 72, 72, 0.95);
  text-transform: uppercase;
  margin-bottom: 12px;
  padding-left: 8px;

  @media ${Screen.largeQuery} {
    font-size: 16px;
  }
`;

const SimilarCreatorsCarousel = styled.div`
  display: flex;
  white-space: nowrap;
  overflow-x: scroll;
  width: 100%;
  padding-bottom: 12px;

  @media ${Screen.largeQuery} {
    margin-left: 8px;
    max-width: 528px;
  }
`;

const SimilarCreatorsIndividual = styled.div`
  margin-left: 8px;
  padding-right: ${props => (props.isLast === true ? `8px` : `0px`)};

  @media ${Screen.largeQuery} {
    margin-left: ${props => (props.isFirst === true ? `0px` : `8px`)};
  }
`;

const CreatorsBannerImage = styled.img`
  width: 160px;
  height: 80px;
  background-color: #d7d7d7;
  /* border: 1px solid #d7d7d7; */
  border: 0;
  border-radius: 2px;
  box-shadow: 0;
  object-fit: cover;

  @media ${Screen.largeQuery} {
    width: 220px;
    height: 124px;
  }
`;

const CreatorName = styled(Text)`
  font-size: 14px;
  font-weight: 600;
`;

const SubscriberCount = styled(Text)`
  font-size: 12px;
`;

const SimilarCreators = props => {
  const { similarCreators } = props;
  return (
    <SimilarCreatorsContainer>
      <SimilarCreatorsTitle>{Copy.similarCreators}</SimilarCreatorsTitle>
      <SimilarCreatorsCarousel>
        {similarCreators.map((creator, index) => {
          const isLast = index === similarCreators.length - 1;
          const isFirst = index === 0;
          return (
            <SimilarCreatorsIndividual key={creator.id} isLast={isLast} isFirst={isFirst}>
              <CreatorsBannerImage src={creator.bannerImageURL} />
              <CreatorName>{creator.displayName}</CreatorName>
              <SubscriberCount>{formatInt(creator.followerCount) + " " + Copy.connections}</SubscriberCount>
            </SimilarCreatorsIndividual>
          );
        })}
      </SimilarCreatorsCarousel>
    </SimilarCreatorsContainer>
  );
};

export default SimilarCreators;
