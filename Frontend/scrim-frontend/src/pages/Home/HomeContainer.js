import { connect } from "react-redux";
import Home from "./Home";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.homeParams
});

export default connect(
  mapStateToProps,
  actions
)(Home);
