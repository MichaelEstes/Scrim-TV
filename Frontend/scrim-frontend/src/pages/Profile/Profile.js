import React from "react";
import { withRouter, Redirect } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Text, Button, FooterPadding } from "../../global/styles/styles";
import { formatInt } from "../../global/utils/utils";
import Colors from "../../global/styles/colors";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompanyFooter from "../../components/CompanyFooter";
import Copy from "../../global/locales/en_us";
import EditSVG from "../../components/SVGIcons/EditSVG";
import { updateProfile, updateProfileImage } from "../../global/api/endpoints";

const ProfileHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ProfileHeaderBackground = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 190px;
  background-color: #892d82;
  background-image: linear-gradient(225deg, #892d82 15%, #2b6ac5 99%);
`;

const UserHeaderInfo = styled.div`
  display: grid;
`;

const DisplayName = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  padding-top: 72px;
  color: ${Colors.lightText};
  letter-spacing: 1px;
  text-align: center;
  justify-self: center;
`;

const UserImage = styled.img`
  width: 140px;
  height: 140px;
  justify-self: center;
  margin-top: 8px;
  border-radius: 50%;
  box-shadow: 2px 6px 18px 0 rgba(183, 183, 183, 0.5);
  content: ${props => (props.src ? props.src : "linear-gradient(-225deg, #ff3cac 0%, #784ba0 51%, #2b86c5 100%)")};
`;

const UserImageEditContainer = styled.div`
  display: grid;
`;

const UserImageInputContainer = styled.div`
  justify-self: end;
`;

const UserImageEdit = styled.input`
  width: 16px;
  height: 16px;
  opacity: 0;
  position: absolute;
`;

const Connections = styled.div`
  justify-self: center;
  display: flex;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 6px;
`;

const FollowerCount = styled(Text)`
  font-size: 16px;
  font-weight: 700;
`;

const FollowerLabel = styled(FollowerCount)`
  font-size: 15px;
`;

const ViewerCount = styled(Text)`
  color: ${Colors.darkSubText};
  font-size: 14px;
  justify-self: center;
`;

const ProfileInfoContainer = styled.div`
  display: grid;
`;

const TaglineContainer = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  padding: 24px 8px;
`;

const AboutContainer = styled.div`
  border-top: 1px solid ${Colors.border};
  display: grid;
  width: 100%;
  padding: 24px 8px;
`;

const SectionTitle = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-left: 1px;
  text-transform: uppercase;
`;

const TaglineSectionTitle = styled(SectionTitle)`
  justify-self: center;
  padding-left: 0px;
`;

const Underline = styled.div`
  height: 1px;
  background: #7b1253;
  width: 46px;
  margin-top: 4px;
`;

const TaglineUnderline = styled(Underline)`
  justify-self: center;
`;

const ProfileTextContainer = styled.div``;

const EditButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 180px;
`;

const EditButton = styled.div`
  cursor: pointer;
  padding: 0px 8px;
`;

const ProfileText = styled(Text)`
  font-size: 16px;
`;

const ProfilePrompt = styled(Text)`
  font-size: 16px;
  color: ${Colors.darkSubText};
`;

const TaglineText = styled(ProfileText)`
  text-align: center;
  max-width: 320px;
`;

const TaglinePrompt = styled(ProfilePrompt)`
  text-align: center;
  max-width: 320px;
`;

const ProfileInputContainer = styled.div`
  display: grid;
`;

const ProfileTextInput = styled.textarea`
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  color: ${Colors.darkText};
  width: 100%;
  margin-top: 12px;
`;

const TaglineTextInput = styled.textarea`
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  color: ${Colors.darkText};
  width: 320px;
  margin-top: 12px;
`;

const SubmitButton = styled(Button)`
  background-color: ${Colors.subscribeButton};
  height: 28px;
  width: 84px;
  font-weight: 700;
  letter-spacing: 0.5;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
  font-size: 14px;
  margin-top: 4px;
  justify-self: end;
`;

const NonCenteredInfoContainer = styled.div`
  justify-self: center;
  width: 100%;
  max-width: 760px;
`;

const VocationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  padding-top: 4px;
`;

const VocationText = styled(Text)`
  color: ${props => props.color};
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 0px;
`;

const VocationDivider = styled.div`
  height: 18px;
  width: 1px;
  background: ${Colors.darkText};
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 6px;
`;
const UserFlagButton = styled.div`
  cursor: pointer;
`;

const UserFlagText = styled(Text)`
  color: ${props => (props.enabled === true ? Colors.lightText : Colors.darkSubText)};
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 4px;
  background-color: ${props => (props.enabled === true ? "#2b6ac5" : "#D3D3D3")};
`;

const LogOutButtonContainer = styled.div`
  width: 100%;
  display: grid;
  padding-top: 12px;
`;

const LogOutButton = styled(Button)`
  background-color: #ffffff00;
  color: ${Colors.scrimBlue};
  width: 160px;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5;
  border-radius: 8px;
  text-transform: uppercase;
  text-align: center;
  background-position: center;
  align-self: center;
  justify-self: center;
  cursor: pointer;
`;

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      imageUploading: false,
      editTagline: false,
      tagline: "",
      editAbout: false,
      about: "",
      vocations: [],
      editVocations: false,
      formats: [],
      editFormats: false,
      initialRender: true
    };
  }

  componentDidMount() {
    const { fetchProfileData } = this.props;
    fetchProfileData();
  }

  componentWillUnmount() {}

  componentDidUpdate() {
    if (this.props.data && this.state.initialRender) {
      const { tagline = "", about = "", imageUrl = "", vocations = [], formats = [] } = this.props.data;
      if (this.state.tagline !== tagline) {
        this.setState({
          tagline: tagline
        });
      }
      if (this.state.about !== about) {
        this.setState({
          about: about
        });
      }
      if (this.state.imageUrl !== imageUrl) {
        this.setState({
          imageUrl: imageUrl
        });
      }
      if (this.state.vocations !== vocations) {
        this.setState({
          vocations: vocations
        });
      }
      if (this.state.formats !== formats) {
        this.setState({
          formats: formats
        });
      }

      this.setState({
        initialRender: false
      });
    }
  }

  onFileUpload = event => {
    const image = Array.from(event.target.files)[0];
    const formData = new FormData();
    formData.append("image", image);

    this.setState({
      imageUploading: true
    });
    updateProfileImage(formData).then(res => {
      gtag("event", "profile_image_updated");
      this.setState({
        imageUrl: res.data,
        imageUploading: false
      });
    });
  };

  editText = key => {
    this.setState({
      [key]: true
    });
  };

  handleChange = (event, key) => {
    this.setState({
      [key]: event.target.value
    });
  };

  submitChange = (key, flagKey) => {
    const body = {
      [key]: this.state[key]
    };

    updateProfile(body).then(res => {
      if (res.status.error) {
        gtag("event", "profile_change_errored", {
          event_label: key
        });
        console.error(res.status.error);
      }
      gtag("event", "profile_change_submitted", {
        event_label: key
      });
      this.setState({
        [flagKey]: false
      });
    });
  };

  getUserFlag = (userFlag, i, type) => {
    if (userFlag.set === true) {
      const name = userFlag.name;
      const colorIndex = Math.floor(Math.random() * 8) + 1 - 1;
      if (i > 0) {
        return (
          <React.Fragment key={name}>
            <VocationDivider />
            <VocationText color={type === "vocations" ? Colors.subscribeButton : Colors.darkBlue} index={colorIndex}>
              {name}
            </VocationText>
          </React.Fragment>
        );
      }
      return (
        <VocationText
          color={type === "vocations" ? Colors.subscribeButton : Colors.darkBlue}
          key={name}
          index={colorIndex}
        >
          {name}
        </VocationText>
      );
    }
  };

  editUserFlags = (userFlags, key, editKey) => {
    return (
      <React.Fragment>
        <VocationContainer>
          {userFlags.map((userFlag, i) => {
            const name = userFlag.name;
            const enabled = userFlag.set;
            const colorIndex = Math.floor(Math.random() * 8) + 1 - 1;
            if (i > 0) {
              return (
                <React.Fragment key={name}>
                  <VocationDivider />
                  <UserFlagButton onClick={() => this.toggleUserFlag(userFlags, i, key)}>
                    <UserFlagText enabled={enabled} index={colorIndex}>
                      {name}
                    </UserFlagText>
                  </UserFlagButton>
                </React.Fragment>
              );
            }
            return (
              <UserFlagButton key={name} onClick={() => this.toggleUserFlag(userFlags, i, key)}>
                <UserFlagText enabled={enabled} index={colorIndex}>
                  {name}
                </UserFlagText>
              </UserFlagButton>
            );
          })}
        </VocationContainer>
        <SubmitButton onClick={() => this.submitChange(key, editKey)}>{Copy.done}</SubmitButton>
      </React.Fragment>
    );
  };

  toggleUserFlag = (userFlags, index, key) => {
    userFlags[index].set = !userFlags[index].set;
    this.setState({
      [key]: userFlags
    });
  };

  logOut = () => {
    document.cookie = "user_id=; Path=/; Domain=.scrim.tv; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    this.props.history.push("/");
  };

  render() {
    const { fetching, data } = this.props;
    let content;

    if (fetching) {
    } else if (data) {
      //Non editable fields stay in props
      const { displayName, followerCount = 0, viewerCount = 0 } = data;
      //Editable fields get maintained in state
      const {
        imageUrl,
        imageUploading,
        editTagline,
        tagline,
        editAbout,
        about,
        vocations,
        editVocations,
        formats,
        editFormats
      } = this.state;

      let vocationsSelected = vocations,
        formatsSelected = formats;

      vocationsSelected = vocationsSelected.filter(vocation => {
        return vocation.set;
      });

      formatsSelected = formatsSelected.filter(format => {
        return format.set;
      });

      const vocationSelected = vocationsSelected.length > 0,
        formatSelected = formatsSelected.length > 0;

      content = (
        <React.Fragment>
          <ProfileHeaderBackground />
          <ProfileHeaderContainer>
            <UserHeaderInfo>
              <DisplayName>{displayName}</DisplayName>
              <UserImage src={!imageUploading ? imageUrl : ""} />
              <UserImageEditContainer>
                <UserImageInputContainer>
                  <UserImageEdit type="file" accept="image/*" onChange={this.onFileUpload} />
                  <EditSVG />
                </UserImageInputContainer>
              </UserImageEditContainer>
              <Connections>
                <FollowerCount>{formatInt(followerCount, true)}</FollowerCount>
                <FollowerLabel>
                  &nbsp;
                  {Copy.connections}
                </FollowerLabel>
              </Connections>
              <ViewerCount>
                {formatInt(viewerCount, true)}
                &nbsp;
                {Copy.profileViews}
              </ViewerCount>
            </UserHeaderInfo>
          </ProfileHeaderContainer>

          <ProfileInfoContainer>
            <TaglineContainer>
              <TaglineSectionTitle>{Copy.tagline}</TaglineSectionTitle>
              <TaglineUnderline />
              <ProfileTextContainer>
                {editTagline ? (
                  <ProfileInputContainer>
                    <TaglineTextInput
                      maxLength="128"
                      rows="3"
                      placeholder={this.state.tagline ? "" : Copy.taglinePrompt}
                      value={this.state.tagline}
                      onChange={e => this.handleChange(e, "tagline")}
                    />
                    <SubmitButton onClick={() => this.submitChange("tagline", "editTagline")}>
                      {Copy.submit}
                    </SubmitButton>
                  </ProfileInputContainer>
                ) : (
                  <React.Fragment>
                    <EditButtonContainer>
                      <EditButton onClick={() => this.editText("editTagline")}>
                        <EditSVG />
                      </EditButton>
                    </EditButtonContainer>
                    {tagline ? (
                      <TaglineText>{tagline}</TaglineText>
                    ) : (
                      <TaglinePrompt>{Copy.taglinePrompt}</TaglinePrompt>
                    )}
                  </React.Fragment>
                )}
              </ProfileTextContainer>
            </TaglineContainer>

            <NonCenteredInfoContainer>
              <AboutContainer>
                <SectionTitle>{Copy.about}</SectionTitle>
                <Underline />
                <ProfileTextContainer>
                  {editAbout ? (
                    <ProfileInputContainer>
                      <ProfileTextInput
                        maxLength="1024"
                        rows="5"
                        placeholder={this.state.about ? "" : Copy.aboutPrompt}
                        value={this.state.about}
                        onChange={e => this.handleChange(e, "about")}
                      />
                      <SubmitButton onClick={() => this.submitChange("about", "editAbout")}>{Copy.submit}</SubmitButton>
                    </ProfileInputContainer>
                  ) : (
                    <React.Fragment>
                      <EditButtonContainer>
                        <EditButton onClick={() => this.editText("editAbout")}>
                          <EditSVG />
                        </EditButton>
                      </EditButtonContainer>
                      {about ? <ProfileText>{about}</ProfileText> : <ProfilePrompt>{Copy.aboutPrompt}</ProfilePrompt>}
                    </React.Fragment>
                  )}
                </ProfileTextContainer>
              </AboutContainer>

              <AboutContainer>
                <SectionTitle>{Copy.vocations}</SectionTitle>
                <Underline />
                <EditButtonContainer>
                  <EditButton onClick={() => this.editText("editVocations")}>
                    <EditSVG />
                  </EditButton>
                </EditButtonContainer>
                {editVocations ? (
                  <React.Fragment>{this.editUserFlags(vocations, "vocations", "editVocations")}</React.Fragment>
                ) : (
                  <React.Fragment>
                    {vocationSelected ? (
                      <VocationContainer>
                        {vocationsSelected.map((vocation, i) => {
                          return this.getUserFlag(vocation, i, "vocations");
                        })}
                      </VocationContainer>
                    ) : (
                      <ProfilePrompt>{Copy.vocationsPrompt}</ProfilePrompt>
                    )}
                  </React.Fragment>
                )}
              </AboutContainer>

              <AboutContainer>
                <SectionTitle>{Copy.formats}</SectionTitle>
                <Underline />
                <EditButtonContainer>
                  <EditButton onClick={() => this.editText("editFormats")}>
                    <EditSVG />
                  </EditButton>
                </EditButtonContainer>
                {editFormats ? (
                  <React.Fragment>{this.editUserFlags(formats, "formats", "editFormats")}</React.Fragment>
                ) : (
                  <React.Fragment>
                    {formatSelected ? (
                      <VocationContainer>
                        {formatsSelected.map((format, i) => {
                          return this.getUserFlag(format, i, "formats");
                        })}
                      </VocationContainer>
                    ) : (
                      <ProfilePrompt>{Copy.formatsPrompt}</ProfilePrompt>
                    )}
                  </React.Fragment>
                )}
              </AboutContainer>
            </NonCenteredInfoContainer>
            <LogOutButtonContainer>
              <LogOutButton onClick={this.logOut}>{Copy.logOut}</LogOutButton>
            </LogOutButtonContainer>
          </ProfileInfoContainer>
        </React.Fragment>
      );
    } else {
      content = <Redirect to="/register" />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Scrim TV: Your profile, time to show off</title>
          <meta
            name="description"
            content="Tell the world who you are. Are you an actor, director, producer or something even better?"
          />
        </Helmet>
        <Header title={"My Profile"} />
        {content}
        <CompanyFooter />
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(Profile);
