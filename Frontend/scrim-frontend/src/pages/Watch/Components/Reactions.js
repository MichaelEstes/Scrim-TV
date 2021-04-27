import React from "react";
import styled, { keyframes } from "styled-components";
import Copy from "../../../global/locales/en_us";
import { Text } from "../../../global/styles/styles";
import { Smile, BigSmile, Laugh, BigLaugh } from "../../../components/SVGIcons/ReactionsSVG";
import { isTouchScreen, debounce } from "../../../global/utils/utils";

const ReactionContainer = styled.div`
  display: flex;
  font-family: "Source Sans Pro", sans-serif;
  padding-top: 12px;
  margin-top: 4px;
  height: 89px;
  padding-bottom: 18px;
  flex-direction: column;
`;

const ReactionRowContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ReactionEmojiRow = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 264px;
`;

const ReactionLabel = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
  color: rgba(72, 72, 72, 0.95);
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const EmojiContainer = styled.div`
  height: 36px;
  width: 36px;
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;
`;

const AnimatedReactionsContainer = styled.div``;

const FloatUp = top => {
  const topTo = top - 100;
  return keyframes`
    from { 
      opacity: 0.45;
      top: ${top + "px"};
    }
    to { 
      opacity: 0;
      top: ${topTo + "px"};;
    }`;
};

const AnimatedEmojiContainer = styled.div`
  position: absolute;
  animation: ${props => `${FloatUp(props.top)} 1s ease-out forwards`};
  padding-left: ${props => `${props.left}px`};
  top: ${props => `${props.top}px`};
`;

class Reactions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reactions: {}
    };
  }

  componentDidMount() {
    window.addEventListener("webkitAnimationEnd", this.reactionEnd);
    window.addEventListener("animationend", this.reactionEnd);
  }

  componentWillUnmount() {
    window.removeEventListener("webkitAnimationEnd", this.reactionEnd);
    window.removeEventListener("animationend", this.reactionEnd);
  }

  reactionEnd = e => {
    delete this.state.reactions[e.target.id];
    this.setState(this.state);
  };

  reactionClicked = reactionId => {
    const { reactions } = this.state;
    const reaction = {
      timestamp: Math.floor(Date.now() / 1000),
      id: reactionId
    };
    reactions[Object.keys(reactions).length] = reaction;
    this.setState({ reactions: reactions });
  };

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getAnimatedReaction = (reaction, index) => {
    const offset = this.randomBetween(-8, 8);
    const top = this.containerRef.getBoundingClientRect().y;

    switch (reaction.id) {
      case 0:
        return (
          <AnimatedEmojiContainer id={index} left={14 + offset} top={top}>
            <Smile />
          </AnimatedEmojiContainer>
        );
      case 1:
        return (
          <AnimatedEmojiContainer id={index} left={81 + offset} top={top}>
            <BigSmile />
          </AnimatedEmojiContainer>
        );
      case 2:
        return (
          <AnimatedEmojiContainer id={index} left={147 + offset} top={top}>
            <Laugh />
          </AnimatedEmojiContainer>
        );
      case 3:
        return (
          <AnimatedEmojiContainer id={index} left={213 + offset} top={top}>
            <BigLaugh />
          </AnimatedEmojiContainer>
        );
      default:
        break;
    }
  };

  animatedReaction = (reaction, index) => {
    return (
      <AnimatedReactionsContainer key={`${reaction.timestamp}${index}`}>
        {this.getAnimatedReaction(reaction, index)}
      </AnimatedReactionsContainer>
    );
  };

  render() {
    const { reactions } = this.state;
    return (
      <ReactionContainer>
        <ReactionLabel>{isTouchScreen() ? Copy.tapReact : Copy.clickReact}</ReactionLabel>
        <ReactionRowContainer>
          {Object.keys(reactions).map(index => this.animatedReaction(reactions[index], index))}
          <ReactionEmojiRow innerRef={elem => (this.containerRef = elem)}>
            <EmojiContainer id="smile" onClick={debounce(() => this.reactionClicked(0), 10000, true)}>
              <Smile />
            </EmojiContainer>
            <EmojiContainer onClick={debounce(() => this.reactionClicked(1), 10000, true)}>
              <BigSmile />
            </EmojiContainer>
            <EmojiContainer onClick={debounce(() => this.reactionClicked(2), 10000, true)}>
              <Laugh />
            </EmojiContainer>
            <EmojiContainer onClick={debounce(() => this.reactionClicked(3), 10000, true)}>
              <BigLaugh />
            </EmojiContainer>
          </ReactionEmojiRow>
        </ReactionRowContainer>
      </ReactionContainer>
    );
  }
}

export default Reactions;
