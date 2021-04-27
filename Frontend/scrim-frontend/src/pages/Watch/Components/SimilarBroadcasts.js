import React from "react";
import styled from "styled-components";
import { Text, Link, Screen } from "../../../global/styles/styles";
import { formatInt } from "../../../global/utils/utils";
import Copy from "../../../global/locales/en_us";

const SimilarBroadcastsContainer = styled.div`
  padding: 12px 8px;

  @media ${Screen.largeQuery} {
    max-width: 552px;
  }
`;

const SimilarBroadcastsTitle = styled(Text)`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;

  @media ${Screen.largeQuery} {
    font-size: 16px;
  }
`;

const BroadcastContainer = styled.div`
  display: inline-flex;
  padding-bottom: 12px;

  @media ${Screen.largeQuery} {
    display: -webkit-box;
  }
`;

const BroadcastImg = styled.img`
  width: 180px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);

  @media ${Screen.largeQuery} {
    width: 220px;
    height: 124px;
  }
`;

const BroadcastTextContainer = styled.div`
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-evenly; */
  justify-content: center;

  @media ${Screen.largeQuery} {
    max-width: 300px;
  }
`;

const BroadcasterName = styled(Text)`
  font-weight: 700;
  text-transform: uppercase;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BroadcastTitle = styled(Text)`
  font-weight: 600;
  padding-top: 6px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ViewerContainer = styled.div`
  display: flex;
  padding-top: 6px;
`;

const Viewers = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  align-self: center;
`;

const ViewersText = styled(Text)`
  font-size: 11px;
  font-weight: 600;
  padding-top: 1px;
  letter-spacing: 0.5px;
  align-self: center;
`;

const SimilarBroadcasts = props => {
  const { similarBroadcasts } = props;
  return (
    <SimilarBroadcastsContainer>
      <SimilarBroadcastsTitle>{Copy.similarBroadcasts}</SimilarBroadcastsTitle>
      {similarBroadcasts.map(broadcast => {
        const { id, imageUrl, title, viewerCount, live, broadcaster } = broadcast;
        return (
          <Link
            to={{
              pathname: "/watch",
              search: `?broadcastId=${id}`,
              broadcast: { ...broadcast }
            }}
            key={id}
          >
            <BroadcastContainer>
              <BroadcastImg src={imageUrl} />
              <BroadcastTextContainer>
                <BroadcasterName>{broadcaster.displayName}</BroadcasterName>
                <BroadcastTitle>{title}</BroadcastTitle>
                <ViewerContainer>
                  <Viewers>{formatInt(viewerCount)}</Viewers>
                  <ViewersText>
                    &nbsp;
                    {live ? Copy.viewers : Copy.views}
                  </ViewersText>
                </ViewerContainer>
              </BroadcastTextContainer>
            </BroadcastContainer>
          </Link>
        );
      })}
    </SimilarBroadcastsContainer>
  );
};

export default SimilarBroadcasts;
