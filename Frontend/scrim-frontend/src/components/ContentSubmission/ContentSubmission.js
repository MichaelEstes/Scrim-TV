import React from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import Copy from "../../global/locales/en_us";
import Colors from "../../global/styles/colors";
import { Text, Label, Button, LoadingSpinner } from "../../global/styles/styles";
import Input from "../../components/Input";
import { postBroadcast, uploadVideo, postPaper } from "../../global/api/endpoints";

const ContentSubmissionContainer = styled.div`
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(100, 100, 100, 0.75);
`;

const ContentSubmissionModalContainer = styled.div`
  width: 720px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 8px;
  background-color: #08aeea;
  background-image: linear-gradient(225deg, #08aeea 0%, #2af598 100%);
  box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.4);
`;

const ContentSubmissionHeader = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  text-align: center;
`;

const ContentSubmissionTitle = styled(Text)`
  color: ${Colors.lightText};
  font-size: 18px;
  font-weight: 700;
  padding: 12px;
  padding-top: 14px;
  text-transform: uppercase;
  text-align: center;
`;

const ContentHeaderDivider = styled.div`
  width: 80%;
  height: 1px;
  background: #ffffff;
  justify-self: center;
`;

const ContentHeaderSpacer = styled.div`
  padding-top: 32px;
`;

const ContentOptionsContainer = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
`;

const ContentOptionButton = styled.button`
  width: 100%;
  display: grid;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  background: none;
  border: none;
  cursor: pointer;
`;

const ContentOptionTextContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentOptionName = styled(Text)`
  color: ${Colors.lightText};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ContentOptionSubtext = styled(Text)`
  color: ${Colors.lightText};
  font-size: 16px;
  font-weight: 600;
`;

const InputContainer = styled.div`
  padding-left: 12px;
  padding-right: 12px;
`;

const ErrorText = styled(Text)`
  font-size: 11px;
  color: ${Colors.lightText};
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const ContentContainer = styled.div``;

const PaperContentContainer = styled.div`
  display: grid;
  padding-left: 12px;
  padding-right: 12px;
`;

const PaperContentInput = styled.textarea`
  width: 100%;
  height: 200px;
  color: ${Colors.darkText};
  font-family: "Source Sans Pro", sans-serif;
  resize: none;
  font-size: 14px;
  padding: 12px 8px;
  outline: none;
  border: ${props => (props.isValid === false ? "2px solid #D42727" : "none")};
  border-radius: 4px;

  ::placeholder {
    color: #9b9b9b;
  }

  :focus {
    outline: 0;
  }
`;

const DescriptionInput = styled(PaperContentInput)`
  height: 100px;
`;

const SubmitButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const SubmitButton = styled(Button)`
  background-color: ${Colors.darkBlue};
  height: 42px;
  width: 112px;
  font-weight: 700;
  font-size: 14px;
  margin-top: 4px;
  letter-spacing: 0.5;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
`;

const DropzoneContainer = styled.div`
  width: 100%;
  padding: 12px;
`;

const VideoDropzone = styled(Dropzone)`
  width: 100%;
  height: 80px;
  border: 2px dashed #ffffff;
  cursor: pointer;
  display: grid;
  justify-content: center;
  align-items: center;
`;

const DropzoneText = styled(Text)`
  color: ${Colors.lightText};
  font-size: 14px;
`;

const VideoText = styled(DropzoneText)`
  text-align: center;
  padding-bottom: 4px;
`;

const BrowseButton = styled(SubmitButton)`
  justify-self: center;
`;

const Steps = {
  selection: "SELECTION",
  input: "INPUT",
  done: "DONE"
};

class ContentSubmission extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: Steps.selection,
      contentType: "",
      title: "",
      titleValid: true,
      description: "",
      descriptionValid: true,
      paperContent: "",
      paperContentValid: true,
      submitting: false,
      videoFile: null,
      videoValid: true,
      thumbnailFile: null,
      thumbnailValid: true,
      postSumbitError: null
    };
  }

  contentOptionSelected = option => {
    gtag("event", "content_option_selected", option.toLowerCase());
    this.setState({
      step: Steps.input,
      contentType: option
    });
  };

  selectionContent = () => {
    const contentOptions = [
      {
        name: Copy.video,
        subtext: Copy.videoSubtext
      },
      {
        name: Copy.paper,
        subtext: Copy.paperSubtext
      }
    ];
    return (
      <React.Fragment>
        <ContentSubmissionHeader>
          <ContentSubmissionTitle>{Copy.submitContent}</ContentSubmissionTitle>
          <ContentHeaderDivider />
          <ContentHeaderSpacer />
        </ContentSubmissionHeader>
        <ContentOptionsContainer>
          {contentOptions.map((option, index) => {
            return (
              <React.Fragment key={index}>
                <ContentOptionButton onClick={() => this.contentOptionSelected(option.name)}>
                  <ContentOptionTextContainer>
                    <ContentOptionName>{option.name}</ContentOptionName>
                  </ContentOptionTextContainer>
                  <ContentOptionTextContainer>
                    <ContentOptionSubtext>{option.subtext}</ContentOptionSubtext>
                  </ContentOptionTextContainer>
                </ContentOptionButton>
                {index < contentOptions.length - 1 && <ContentHeaderDivider />}
              </React.Fragment>
            );
          })}
        </ContentOptionsContainer>
        <ContentHeaderSpacer />
        <ContentHeaderSpacer />
      </React.Fragment>
    );
  };

  onTitleChange = e => {
    this.setState({
      title: e.target.value
    });
  };

  onDescriptionChange = e => {
    this.setState({
      description: e.target.value
    });
  };

  onPaperContentChange = e => {
    this.setState({
      paperContent: e.target.value
    });
  };

  submitContent = () => {
    const { contentType } = this.state;
    gtag("event", "content_sumbit_clicked", contentType);

    switch (contentType) {
      case Copy.video:
        if (this.validVideoSubmission() === true) {
          this.setState({ submitting: true });
          const body = {
            title: this.state.title,
            description: this.state.description
          };
          const formData = new FormData();
          formData.append("video", this.state.videoFile);
          formData.append("thumbnail", this.state.thumbnailFile);
          postBroadcast(body).then(res => {
            if (res.data) {
              uploadVideo(res.data, formData).then(this.submitContentCompleted);
            } else {
              this.submitContentCompleted(res);
            }
          });
        }
        break;
      case Copy.paper:
        if (this.validPaperSubmission() === true) {
          this.setState({ submitting: true });
          const body = {
            title: this.state.title,
            content: this.state.paperContent
          };
          postPaper(body).then(this.submitContentCompleted);
        }
        break;
    }
  };

  submitContentCompleted = res => {
    const { contentType } = this.state;

    if (res.status.error) {
      gtag("event", "content_sumbit_error", contentType);
    } else {
      gtag("event", "content_sumbit_successful", contentType);
    }

    this.setState({
      submitting: false,
      postSumbitError: res.status.error,
      step: Steps.done
    });

    setTimeout(() => {
      this.props.onDone(res);
    }, 2000);
  };

  validVideoSubmission = () => {
    const { title, description, videoFile, thumbnailFile } = this.state;
    const titleValid = title.length > 1;
    const descriptionValid = description.length > 20;
    const videoValid = videoFile != null;
    const thumbnailValid = thumbnailFile != null;

    this.setState({
      titleValid: titleValid,
      descriptionValid: descriptionValid,
      videoValid: videoValid,
      thumbnailValid: thumbnailValid
    });

    return titleValid && descriptionValid && videoValid && thumbnailValid;
  };

  validPaperSubmission = () => {
    const { title, paperContent } = this.state;
    const titleValid = title.length > 1;
    const paperContentValid = paperContent.length > 100;

    this.setState({
      titleValid: titleValid,
      paperContentValid: paperContentValid
    });
    return titleValid && paperContentValid;
  };

  onDrop = files => {
    if (files[0]) {
      this.setState({
        videoFile: files[0]
      });
    }
  };

  onDropThumbnail = files => {
    if (files[0]) {
      this.setState({
        thumbnailFile: files[0]
      });
    }
  };

  contentInputByType = () => {
    const { contentType } = this.state;
    switch (contentType) {
      case Copy.video:
        return (
          <React.Fragment>
            <InputContainer>
              <Label>{Copy.description}</Label>
              <DescriptionInput
                maxLength="65535"
                isValid={this.state.descriptionValid}
                value={this.state.description}
                onChange={this.onDescriptionChange}
                placeholder={Copy.descriptionPlaceholder}
              />
              {!this.state.descriptionValid && <ErrorText>{Copy.descriptionError}</ErrorText>}
            </InputContainer>
            {!this.state.videoFile ? (
              <DropzoneContainer>
                <VideoDropzone onDrop={this.onDrop} accept="video/mp4" multiple={false}>
                  <DropzoneText>{Copy.dropVideo}</DropzoneText>
                  <BrowseButton>{Copy.browse}</BrowseButton>
                </VideoDropzone>
                {!this.state.videoValid && <ErrorText>{Copy.videoError}</ErrorText>}
              </DropzoneContainer>
            ) : (
              <DropzoneContainer>
                <VideoText>{this.state.videoFile.name}</VideoText>
                {!this.state.thumbnailFile ? (
                  <React.Fragment>
                    <VideoDropzone onDrop={this.onDropThumbnail} accept="image/*" multiple={false}>
                      <DropzoneText>{Copy.dropThumbnail}</DropzoneText>
                      <BrowseButton>{Copy.browse}</BrowseButton>
                    </VideoDropzone>
                    {!this.state.thumbnailValid && <ErrorText>{Copy.thumbnailError}</ErrorText>}
                  </React.Fragment>
                ) : (
                  <VideoText>{this.state.thumbnailFile.name}</VideoText>
                )}
              </DropzoneContainer>
            )}
          </React.Fragment>
        );
      case Copy.paper:
        return (
          <React.Fragment>
            <PaperContentContainer>
              <Label>{Copy.paperContent}</Label>
              <PaperContentInput
                maxLength="65535"
                placeholder={Copy.paperContentPlaceholder}
                value={this.state.paperContent}
                onChange={this.onPaperContentChange}
                isValid={this.state.paperContentValid}
              />
              {!this.state.paperContentValid && <ErrorText>{Copy.paperContentError}</ErrorText>}
            </PaperContentContainer>
          </React.Fragment>
        );
        break;
    }
  };

  inputContent = () => {
    return (
      <React.Fragment>
        <ContentSubmissionHeader>
          <ContentSubmissionTitle>{Copy.inputTitle}</ContentSubmissionTitle>
          <ContentHeaderDivider />
          <ContentHeaderSpacer />
        </ContentSubmissionHeader>
        <InputContainer>
          <Label>{Copy.title}</Label>
          <Input
            type="text"
            fluid
            isValid={this.state.titleValid}
            value={this.state.title}
            onChange={this.onTitleChange}
            placeholder={Copy.titlePlaceholder}
          />
          {!this.state.titleValid && <ErrorText>{Copy.titleError}</ErrorText>}
        </InputContainer>
        <ContentContainer>
          {this.contentInputByType()}
          <SubmitButtonContainer>
            <SubmitButton onClick={this.submitContent}>
              {this.state.submitting ? "" : Copy.submit}
              {this.state.submitting && <LoadingSpinner />}
            </SubmitButton>
          </SubmitButtonContainer>
        </ContentContainer>
      </React.Fragment>
    );
  };

  doneContent = () => {
    return (
      <React.Fragment>
        <ContentHeaderSpacer />
        <ContentHeaderSpacer />
        {this.state.postSumbitError ? (
          <React.Fragment>
            <ContentSubmissionTitle>{Copy.ohNo}</ContentSubmissionTitle>
            <ContentSubmissionTitle>{Copy.submitError}</ContentSubmissionTitle>
          </React.Fragment>
        ) : (
          <ContentSubmissionTitle>{Copy.submitMessage}</ContentSubmissionTitle>
        )}
        <ContentHeaderSpacer />
        <ContentHeaderSpacer />
      </React.Fragment>
    );
  };

  render() {
    const { step } = this.state;

    let modalContent = {};

    switch (step) {
      case Steps.selection:
        modalContent = this.selectionContent();
        break;
      case Steps.input:
        modalContent = this.inputContent();
        break;
      case Steps.done:
        modalContent = this.doneContent();
        break;
    }

    return (
      <ContentSubmissionContainer>
        <ContentSubmissionModalContainer>{modalContent}</ContentSubmissionModalContainer>
      </ContentSubmissionContainer>
    );
  }
}

export default ContentSubmission;
