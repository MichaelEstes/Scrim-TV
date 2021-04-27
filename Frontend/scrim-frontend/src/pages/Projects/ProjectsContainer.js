import { connect } from "react-redux";
import Projects from "./Projects";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.projectsParams
});

export default connect(
  mapStateToProps,
  actions
)(Projects);
