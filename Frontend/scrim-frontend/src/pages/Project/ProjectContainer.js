import { connect } from "react-redux";
import Project from "./Project";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.projectParams
});

export default connect(
  mapStateToProps,
  actions
)(Project);
