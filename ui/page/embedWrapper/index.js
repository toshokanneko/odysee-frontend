import { buildURI } from 'util/lbryURI';
import { connect } from 'react-redux';
import { doPlayUri } from 'redux/actions/content';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri, selectIsUriResolving } from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import { selectCostInfoForUri, doFetchCostInfoForUri, selectBlackListedOutpoints } from 'lbryinc';
import EmbedWrapperPage from './view';

const select = (state, props) => {
  const {
    match: { params },
  } = props;

  const { claimName, claimId } = params;
  const uri = claimName ? buildURI({ claimName, claimId }) : '';

  return {
    blackListedOutpoints: selectBlackListedOutpoints(state),
    claim: makeSelectClaimForUri(uri)(state),
    costInfo: selectCostInfoForUri(state, uri),
    isResolvingUri: selectIsUriResolving(state, uri),
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    uri,
  };
};

const perform = (dispatch, ownProps) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  playUri: (uri) => dispatch(doPlayUri(uri)),
  fetchCostInfoForUri: (uri) => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(select, perform)(EmbedWrapperPage);
