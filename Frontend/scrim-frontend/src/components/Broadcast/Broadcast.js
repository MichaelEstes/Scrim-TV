import React from "react";
import { Text, SubText, Screen, Link } from "../../global/styles/styles";
import { formatInt, getHoursFromSeconds, getMinutesFromSeconds, airTimeString } from "../../global/utils/utils";
import Copy from "../../global/locales/en_us";
import Colors from "../../global/styles/colors";
import styled from "styled-components";
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

export const BroadcastTitle = styled(Text)`
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

const BroadcastImgContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-top: 8px;
  border-radius: 8px;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
`;

const BroadcastImg = styled.img`
  width: 356px;
  height: 200px;
  transition: 0.3s ease;
`;

export const ViewerContainer = styled.div`
  display: flex;
`;

const LiveIndicator = styled(Text)`
  border-radius: 4px;
  align-self: center;
  background-color: ${Colors.live};
  color: #fff;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  width: 48px;
  text-align: center;
  padding-top: 1px;
  margin-left: 8px;
`;

export const Viewers = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.5px;
  align-self: center;
`;

export const ViewersText = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  padding-top: 1px;
  letter-spacing: 0.5px;
  align-self: center;
`;

export const AirTime = styled(SubText)`
  font-size: 12px;
  padding-top: 2px;
`;

const RunTime = styled(Viewers)``;

const RunTimeText = styled(ViewersText)``;

const BroadcastContentContainer = styled.div`
  &:hover ${BroadcastImg} {
    transform: scale(1.1);
  }
`;

const Broadcast = props => {
  const { id, broadcaster, title, imageUrl, live, viewerCount, airtime, runtime } = props;
  let hours, minutes, seconds;

  if (runtime > 60) {
    hours = getHoursFromSeconds(runtime);
    minutes = getMinutesFromSeconds(runtime);
  } else {
    seconds = runtime;
  }

  return (
    <BroadcastContainer>
      <TopRowContainer>
        <Creator type="Broadcast" {...broadcaster} />
        {live && <LiveIndicator>{Copy.live}</LiveIndicator>}
      </TopRowContainer>
      <Link to={{ pathname: "/watch", search: `?broadcastId=${id}`, broadcast: { ...props } }}>
        <BroadcastContentContainer>
          <BroadcastImgContainer>
            <BroadcastImg src={imageUrl} />
          </BroadcastImgContainer>
          <BroadcastTitle>{title}</BroadcastTitle>
          <ViewerContainer>
            <Viewers>{formatInt(viewerCount)}</Viewers>
            <ViewersText>
              &nbsp;
              {live ? Copy.viewers : Copy.views}
            </ViewersText>
            {!live && (
              <React.Fragment>
                <RunTime>&nbsp;•&nbsp;</RunTime>
                {hours ? (
                  <React.Fragment>
                    <RunTime>
                      {hours}
                      &nbsp;
                    </RunTime>
                    <RunTimeText>
                      {Copy.hr}
                      &nbsp;
                    </RunTimeText>
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )}
                {minutes ? (
                  <React.Fragment>
                    <RunTime>
                      {minutes}
                      &nbsp;
                    </RunTime>
                    <RunTimeText>{Copy.min}</RunTimeText>
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )}
                {seconds ? (
                  <React.Fragment>
                    <RunTime>
                      {seconds}
                      &nbsp;
                    </RunTime>
                    <RunTimeText>{Copy.sec}</RunTimeText>
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )}
              </React.Fragment>
            )}
          </ViewerContainer>
          <AirTime>{`${airTimeString(live)} ${airtime}`}</AirTime>
        </BroadcastContentContainer>
      </Link>
    </BroadcastContainer>
  );
};

export default Broadcast;
