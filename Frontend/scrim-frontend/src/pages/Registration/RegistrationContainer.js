import { connect } from "react-redux";

import Registration from "./Registration";
import actions from "../../redux/actions";

const mapStateToProps = state => {
  return {
    successfullyRegistered: state.registrationParams.registered
  };
};

export default connect(
  mapStateToProps,
  actions
)(Registration);
