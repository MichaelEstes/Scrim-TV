import { connect } from "react-redux";
import Connect from "./Connect";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.connectParams
});

export default connect(
  mapStateToProps,
  actions
)(Connect);
