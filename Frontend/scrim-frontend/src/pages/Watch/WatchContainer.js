import { connect } from "react-redux";
import Watch from "./Watch";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.videoParams
});

export default connect(
  mapStateToProps,
  actions
)(Watch);
