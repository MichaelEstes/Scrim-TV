import React from "react";
import styled from "styled-components";
import { ContentText, ContentFirstLetter, ContentFirstWord, Link } from "../../global/styles/styles";
import { BroadcastTitle, ViewerContainer, Viewers, ViewersText, AirTime } from "../Broadcast/Broadcast";
import { formatInt } from "../../global/utils/utils";
import Copy from "../../global/locales/en_us";
import Creator from "../Creator";

const BroadcastContainer = styled.div`
  width: 100vw;
  max-width: 356px;
  display: grid;
  cursor: pointer;
`;

const TopRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BroadcastImgContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-top: 8px;
  border-radius: 8px;
`;

const ContentPreview = styled(ContentText)`
  width: 356px;
  height: 200px;
  max-height: 7.6em;
  line-height: 1.2em;
  margin-bottom: 12px;
  transition: 0.3s ease;
  padding-top: 0px;
  padding-bottom: 0px;
`;

const BroadcastContentContainer = styled.div`
  &:hover ${ContentPreview} {
    transform: scale(1.1);
  }
`;

const Paper = props => {
  const { id, creator, title, content, viewerCount, publishedTime } = props;

  var i = 0;
  for (i; i < content.length; i++) {
    if (content.charAt(i) === " ") {
      break;
    }
  }

  const contentFirstLetter = content.substring(0, 1);
  const contentFirstWord = content.substring(1, i);
  const contentPreview = content.substring(i, content.length - 1);

  return (
    <BroadcastContainer>
      <TopRowContainer>
        <Creator type="Paper" {...creator} />
      </TopRowContainer>
      <Link to={{ pathname: "/read", search: `?paperId=${id}`, paper: { ...props } }}>
        <BroadcastContentContainer>
          <BroadcastImgContainer>
            <ContentPreview>
              <ContentFirstLetter>{contentFirstLetter}</ContentFirstLetter>
              <ContentFirstWord>{contentFirstWord}</ContentFirstWord>
              &nbsp;
              {contentPreview}
            </ContentPreview>
          </BroadcastImgContainer>
          <BroadcastTitle>{title}</BroadcastTitle>
          <ViewerContainer>
            <Viewers>{formatInt(viewerCount)}</Viewers>
            <ViewersText>
              &nbsp;
              {Copy.views}
            </ViewersText>
          </ViewerContainer>
          <AirTime>{`${Copy.published} ${publishedTime}`}</AirTime>
        </BroadcastContentContainer>
      </Link>
    </BroadcastContainer>
  );
};

export default Paper;
