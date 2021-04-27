import React from "react";
import styled from "styled-components";
import Copy from "../../global/locales/en_us";
import Colors from "../../global/styles/colors";
import { Text, Screen, Link } from "../../global/styles/styles";

const CreatorImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  align-self: center;
  transition: 0.3s ease;
`;

const CreatorTextContainer = styled.div`
  padding-left: 6px;
`;

const CreatorName = styled(Text)`
  font-size: 16px;
  line-height: 14px;
  font-weight: 700;
  padding-top: 6px;
  padding-left: 2px;
  letter-spacing: 0.5px;

  @media ${Screen.tinyQuery} {
    max-width: 170px;
  }

  @media ${Screen.smallQuery} {
    max-width: 220px;
  }

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

const PresentsText = styled(Text)`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: ${Colors.presentsAccent};
  padding-left: 2px;
`;

const CreatorContainer = styled.div`
  display: flex;

  &:hover ${CreatorImg} {
    transform: scale(1.2);
    box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
  }
`;

const Creator = creator => {
  const { id, type } = creator;

  return (
    <Link to={{ pathname: "/user/" + id }}>
      <CreatorContainer>
        <CreatorImg src={creator.imageUrl} />
        <CreatorTextContainer>
          <CreatorName>{creator.displayName}</CreatorName>
          <PresentsText>{type === "Broadcast" ? Copy.presents : Copy.submits}</PresentsText>
        </CreatorTextContainer>
      </CreatorContainer>
    </Link>
  );
};

export default Creator;
