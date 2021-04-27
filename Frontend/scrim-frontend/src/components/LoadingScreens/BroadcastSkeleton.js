import React from "react";
import styled, { keyframes } from "styled-components";
import Colors from "../../global/styles/colors";
import { HeaderPadding, Screen } from "../../global/styles/styles";
import MediaQuery from "react-responsive";

export const fadeInOut = keyframes`
    0%,100% { 
      opacity: 0.45;
    }
    50% { 
      opacity: 1;
    }
`;

const SkeletonContainer = styled.div`
  width: 100%;
  margin-top: ${props => (props.top ? "54px" : "0px")};
  padding-top: ${props => (props.top ? "0px" : "36px")};

  @media ${Screen.largeQuery} {
    margin-left: 48px;
  }

  @media ${Screen.mediumQuery} {
    margin-left: 48px;
  }
`;

const SkeletonBase = styled.div`
  background-color: ${Colors.skeletonLight};
  margin-left: 10px;
  animation: ${fadeInOut} 2s linear forwards;
  animation-iteration-count: infinite;
`;

const SkeletonUserTitle = styled(SkeletonBase)`
  width: 102px;
  height: 15px;
`;

const SkeletonPresents = styled(SkeletonBase)`
  width: 57px;
  height: 13px;
  margin-top: 4px;
  background-color: ${Colors.presentsAccent};
`;

const SkeletonBroadcastTitle = styled(SkeletonBase)`
  width: ${props => (props.top ? "354px" : "185px")};
  height: 17px;
  margin-top: 4px;
`;

const SkeletonBroadcastImage = styled(SkeletonBase)`
  width: 352px;
  height: 200px;
  border-radius: 8px;
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
`;

const SkeletonUserImage = styled(SkeletonBase)`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background-color: ${Colors.skeletonDark};
`;

const SkeletonViewCount = styled(SkeletonBase)`
  width: 102px;
  height: 17px;
  margin-top: 8px;
  background-color: ${Colors.skeletonLighter};
`;

const SkeletonStreamTime = styled(SkeletonBase)`
  width: 81px;
  height: 12px;
  margin-top: 4px;
  background-color: ${Colors.skeletonLighter};
`;

const BroadcasterContainer = styled.div`
  display: inline-flex;
`;

const BroadcasterTextContainer = styled.div`
  padding-left: 6px;
`;

const BroadcastSkeleton = props => (
  <React.Fragment>
    <HeaderPadding />
    <SkeletonContainer top>
      <BroadcasterContainer>
        <SkeletonUserImage />
        <BroadcasterTextContainer>
          <SkeletonUserTitle />
          <SkeletonPresents />
        </BroadcasterTextContainer>
      </BroadcasterContainer>
      <SkeletonBroadcastImage />
      <SkeletonBroadcastTitle top />
      <SkeletonBroadcastTitle />
      <SkeletonViewCount />
      <SkeletonStreamTime />
    </SkeletonContainer>
    <SkeletonContainer>
      <BroadcasterContainer>
        <SkeletonUserImage />
        <BroadcasterTextContainer>
          <SkeletonUserTitle />
          <SkeletonPresents />
        </BroadcasterTextContainer>
      </BroadcasterContainer>
      <SkeletonBroadcastImage />
      <SkeletonBroadcastTitle top />
      <SkeletonBroadcastTitle />
      <SkeletonViewCount />
      <SkeletonStreamTime />
    </SkeletonContainer>
  </React.Fragment>
);

export default BroadcastSkeleton;
