import React, { Component } from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Text, Link, Label, Button } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";
import Copy from "../../global/locales/en_us";
import { validatePhone, validateEmail, validateDisplayName, validatePassword } from "../../global/utils/validators";
import Input from "../../components/Input";
import { postRegister } from "../../global/api/endpoints";
import { resetUserContext } from "../../global/utils/auth";

const RegistrationContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: ${props => (props.center ? "center" : "flex-start")};
  align-items: center;
  height: 100%;
  min-height: 100vh;
  flex-direction: column;
  background-color: #08aeea;
  background-image: linear-gradient(225deg, #08aeea 0%, #2af598 100%);
  padding: 9px 53px 49px 53px;
`;

const ScrimLogoContainer = styled.div`
  padding-top: 4px;
`;

const ScrimLogo = styled.img`
  height: 42px;
`;

const RegistrationDetails = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  padding-top: 24px;
  max-width: 360px;
`;

const CreateAccountHeader = styled(Text)`
  font-weight: 700;
  color: ${Colors.lightText};
  letter-spacing: 2px;
  font-size: 24px;
  padding-top: 32px;
`;

const PhoneNumberContainer = styled.div`
  display: grid;
  width: 100%;
`;

const PhoneLabelContainer = styled.div`
  display: flex;
`;

const PhoneHelper = styled(Text)`
  font-size: 11px;
  color: ${Colors.lightText};
  letter-spacing: 0.5px;
  width: 180px;
  margin-top: 14px;
  text-align: right;
`;

const RecommendedText = styled(Text)`
  font-size: 11px;
  color: ${Colors.lightText};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-top: 2px;
  padding-bottom: 12px;
`;

const ErrorText = styled(Text)`
  font-size: 11px;
  color: ${Colors.lightText};
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const DividerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: ${props => (props.width ? `${props.width}%` : "100%")};
  align-items: center;
  justify-content: center;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  color: #fff;
  letter-spacing: 0.8px;
  margin-top: 18px;
  margin-bottom: 18px;
`;

const Divider = styled.hr`
  border: 0;
  clear: both;
  display: block;
  width: 75px;
  background-color: #fff;
  height: 1px;
`;

const RegistrationErrorText = styled(Text)`
  font-size: 12px;
  color: #d42727;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-top: 16px;
  padding-bottom: 2px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
`;

const CreateAccountButton = styled(Button)`
  width: 270px;
  height: 56px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2.1px;
  background-color: #39579d;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  color: #fff;
  margin-bottom: 10px;
  margin-top: 32px;
  text-transform: uppercase;
`;

const LogInButton = styled(Button)`
  width: 270px;
  height: 60px !important;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2.1px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0);
  padding-top: 24px;
  text-transform: uppercase;
`;

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      phoneValid: true,
      displayName: "",
      displayNameValid: true,
      email: "",
      emailValid: true,
      password: "",
      passwordValid: true,
      confirmedPassword: "",
      passwordsMatch: true,
      registrationError: ""
    };
  }

  componentDidUpdate() { }

  onInputChange = (e, id) => {
    this.setState({
      [id]: e.target.value
    });
  };

  isPhoneValid = () => {
    const phoneValid = validatePhone(this.state.phone);
    this.setState({ phoneValid: phoneValid });

    return phoneValid;
  };

  isEmailValid = () => {
    const emailValid = validateEmail(this.state.email);
    this.setState({ emailValid: emailValid });

    return emailValid;
  };

  isDisplayNameValid = () => {
    const displayNameValid = this.state.displayName.length > 3 && validateDisplayName(this.state.displayName);
    this.setState({ displayNameValid: displayNameValid });

    return displayNameValid;
  };

  isPasswordValid = () => {
    const passwordValid = validatePassword(this.state.password);
    this.setState({ passwordValid: passwordValid });

    return passwordValid;
  };

  doPasswordsMatch = () => {
    const passwordsMatch = this.state.password === this.state.confirmedPassword;
    this.setState({ passwordsMatch: passwordsMatch });

    return passwordsMatch;
  };

  createAccount = () => {
    let validRegistration = true;
    if (this.state.phone.length > 0) {
      validRegistration = this.isPhoneValid();
    } else {
      const validEmail = this.isEmailValid();
      const validDisplayName = this.isDisplayNameValid();
      const validPassword = this.isPasswordValid();
      const passwordsMatch = this.doPasswordsMatch();
      validRegistration = validEmail && validDisplayName && validPassword && passwordsMatch;
    }

    if (validRegistration) {
      const body = this.getRegisterBody();
      postRegister(body).then(res => {
        if (res.status.error) {
          gtag("event", "error_creating_account");
          this.setState({ registrationError: res.status.error });
        } else {
          gtag("event", "account_created");
          resetUserContext().then(() => {
            this.props.history.push("/profile");
          });
        }
      });
    }
  };

  getRegisterBody = () => {
    const { phone, email, displayName, password } = this.state;
    return {
      phone,
      email,
      displayName,
      password
    };
  };

  render() {
    const { phone, email, displayName, password, confirmedPassword } = this.state;
    const { phoneValid, emailValid, displayNameValid, passwordValid, passwordsMatch, registrationError } = this.state;

    return (
      <RegistrationContainer>
        <Helmet>
          <title>Scrim TV: Create a new account</title>
          <meta
            name="description"
            content="Are you a content creator? Create a Scrim TV account to connect, collaborate and create"
          />
        </Helmet>
        <React.Fragment>
          <Link to={{ pathname: "/" }}>
            <ScrimLogoContainer>
              <ScrimLogo src={"https://127.0.0.1/scrim-frontend/Scrim-Logo-Web.png"} />
            </ScrimLogoContainer>
          </Link>
          <CreateAccountHeader>{Copy.createAccount}</CreateAccountHeader>
        </React.Fragment>

        <RegistrationDetails>
          {/* <PhoneNumberContainer>
            <PhoneLabelContainer>
              <Label>{Copy.phoneNumber}</Label>
              <PhoneHelper>{Copy.phoneHelper}</PhoneHelper>
            </PhoneLabelContainer>
            <Input
              type="tel"
              fluid
              isValid={phoneValid}
              value={phone}
              onChange={e => this.onInputChange(e, "phone")}
              placeholder={Copy.phonePlaceHolder}
            />
            <RecommendedText>{Copy.recommended}</RecommendedText>
            {!phoneValid && <ErrorText>{Copy.phoneError}</ErrorText>}
          </PhoneNumberContainer> */}

          {phone.length === 0 && (
            <React.Fragment>
              {/* <DividerContainer>
                <Divider /> OR <Divider />
              </DividerContainer> */}

              <PhoneLabelContainer>
                <Label>{Copy.email}</Label>
                <PhoneHelper>{Copy.phoneHelper}</PhoneHelper>
              </PhoneLabelContainer>
              <Input
                type="email"
                fluid
                isValid={emailValid}
                value={email}
                onChange={e => this.onInputChange(e, "email")}
                placeholder={Copy.emailPlaceholder}
              />
              {!emailValid && <ErrorText>{Copy.emailError}</ErrorText>}

              <Label>{Copy.displayName}</Label>
              <Input
                type="text"
                fluid
                isValid={displayNameValid}
                value={displayName}
                onChange={e => this.onInputChange(e, "displayName")}
                placeholder={Copy.displayNamePlaceholder}
              />
              {!displayNameValid && <ErrorText>{Copy.displayNameError}</ErrorText>}

              <Label>{Copy.password}</Label>
              <Input
                type="password"
                fluid
                isValid={passwordValid}
                value={password}
                onChange={e => this.onInputChange(e, "password")}
                placeholder={Copy.passwordPlaceHolder}
              />
              {!passwordValid && <ErrorText>{Copy.passwordError}</ErrorText>}

              <Label>{Copy.confirmPassword}</Label>
              <Input
                type="password"
                fluid
                isValid={passwordsMatch}
                value={confirmedPassword}
                onChange={e => this.onInputChange(e, "confirmedPassword")}
                placeholder={Copy.passwordPlaceHolder}
              />
              {!passwordsMatch && <ErrorText>{Copy.comfirmedPasswordError}</ErrorText>}
            </React.Fragment>
          )}

          {registrationError && <RegistrationErrorText>{registrationError}</RegistrationErrorText>}
          <ButtonContainer>
            <CreateAccountButton onClick={this.createAccount}>{Copy.createAccount}</CreateAccountButton>
            <Link to={"/login"}>
              <LogInButton>{Copy.logIn}</LogInButton>
            </Link>
          </ButtonContainer>
        </RegistrationDetails>
      </RegistrationContainer>
    );
  }
}

export default withRouter(Registration);
