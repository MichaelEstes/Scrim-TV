import { connect } from "react-redux";
import Read from "./Read";
import actions from "../../redux/actions";

const mapStateToProps = state => ({
  ...state.paperParams
});

export default connect(
  mapStateToProps,
  actions
)(Read);
