import { connect } from "react-redux";
import User from "./User";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.userParams
});

export default connect(
  mapStateToProps,
  actions
)(User);
