import { connect } from "react-redux";
import Profile from "./Profile";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.profileParams
});

export default connect(
  mapStateToProps,
  actions
)(Profile);
