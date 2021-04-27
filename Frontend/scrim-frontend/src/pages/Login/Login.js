import React, { Component } from "react";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Text, Link, Label, Button } from "../../global/styles/styles";
import Colors from "../../global/styles/colors";
import Copy from "../../global/locales/en_us";
import Input from "../../components/Input";
import { validateEmail, validatePassword } from "../../global/utils/validators";
import { postLogin } from "../../global/api/endpoints";
import { resetUserContext } from "../../global/utils/auth";

const LoginContainer = styled.div`
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

const LoginDetails = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  padding-top: 24px;
  max-width: 360px;
`;

const LoginHeader = styled(Text)`
  font-weight: 700;
  color: ${Colors.lightText};
  letter-spacing: 2px;
  font-size: 24px;
  padding-top: 32px;
`;

const ErrorText = styled(Text)`
  font-size: 11px;
  color: ${Colors.lightText};
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
`;

const LoginErrorText = styled(Text)`
  font-size: 12px;
  color: #d42727;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding-top: 16px;
  padding-bottom: 2px;
  text-align: center;
`;

const LogInButton = styled(Button)`
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

const RegisterButton = styled(Button)`
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailValid: true,
      password: "",
      passwordValid: true,
      loginError: false
    };
  }

  onInputChange = (e, id) => {
    this.setState({
      [id]: e.target.value
    });
  };

  isEmailValid = () => {
    const emailValid = validateEmail(this.state.email);
    this.setState({ emailValid: emailValid });

    return emailValid;
  };

  isPasswordValid = () => {
    const passwordValid = validatePassword(this.state.password);
    this.setState({ passwordValid: passwordValid });

    return passwordValid;
  };

  logIn = () => {
    let validLogin = true;
    const validEmail = this.isEmailValid();
    const validPassword = this.isPasswordValid();
    validLogin = validEmail && validPassword;

    if (validLogin) {
      const body = this.getLoginBody();
      try {
        postLogin(body).then(res => {
          if (res.data) {
            gtag("event", "login");
            resetUserContext().then(() => {
              this.props.history.push("/");
            });
          } else {
            gtag("event", "error_logging_in");
            this.setState({ loginError: true });
          }
        });
      } catch (e) {
        this.setState({ loginError: true });
      }
    }
  };

  getLoginBody = () => {
    const { email, password } = this.state;
    return {
      email,
      password
    };
  };

  render() {
    const { email, password } = this.state;
    const { emailValid, passwordValid, loginError } = this.state;

    return (
      <LoginContainer>
        <Helmet>
          <title>Scrim TV: Log in to post content and connect with creators</title>
          <meta name="description" content="Log in to get full access to the best indie content and creators" />
        </Helmet>
        <React.Fragment>
          <Link to={{ pathname: "/" }}>
            <ScrimLogoContainer>
              <ScrimLogo src={"https://127.0.0.1/scrim-frontend/Scrim-Logo-Web.png"} />
            </ScrimLogoContainer>
          </Link>
          <LoginHeader>{Copy.logIn}</LoginHeader>
        </React.Fragment>

        <LoginDetails>
          <Label>{Copy.email}</Label>
          <Input
            type="email"
            fluid
            isValid={emailValid}
            value={email}
            onChange={e => this.onInputChange(e, "email")}
            placeholder={Copy.emailPlaceholder}
          />
          {!emailValid && <ErrorText>{Copy.emailError}</ErrorText>}
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

          {loginError && <LoginErrorText>{Copy.logInError}</LoginErrorText>}
          <ButtonContainer>
            <LogInButton onClick={this.logIn}>{Copy.logIn}</LogInButton>
            <Link to={"/register"}>
              <RegisterButton>{Copy.createAccount}</RegisterButton>
            </Link>
          </ButtonContainer>
        </LoginDetails>
      </LoginContainer>
    );
  }
}

export default withRouter(Login);
