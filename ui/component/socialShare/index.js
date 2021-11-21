import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import { selectUserInviteReferralCode, selectUser } from 'redux/selectors/user';
import SocialShare from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
  referralCode: selectUserInviteReferralCode(state),
  title: selectTitleForUri(state, props.uri),
  user: selectUser(state),
});

export default connect(select)(SocialShare);
