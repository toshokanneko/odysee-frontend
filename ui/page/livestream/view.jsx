// @flow
import React from 'react';
import Page from 'component/page';
import LivestreamLayout from 'component/livestreamLayout';
import LivestreamComments from 'component/livestreamComments';
import analytics from 'analytics';
import moment from 'moment';
import watchLivestreamStatus from '$web/src/livestreaming/long-polling';

type Props = {
  uri: string,
  claim: StreamClaim,
  doSetPlayingUri: ({ uri: ?string }) => void,
  isAuthenticated: boolean,
  doUserSetReferrer: (string) => void,
  channelClaim: ChannelClaim,
  chatDisabled: boolean,
};

export default function LivestreamPage(props: Props) {
  const { uri, claim, doSetPlayingUri, isAuthenticated, doUserSetReferrer, channelClaim, chatDisabled } = props;

  const [isBroadcasting, setIsBroadcasting] = React.useState('pending');
  const livestreamChannelId = channelClaim && channelClaim.signing_channel && channelClaim.signing_channel.claim_id;

  React.useEffect(() => {
    if (!livestreamChannelId) {
      setIsBroadcasting(false);
      return;
    }
    return watchLivestreamStatus(livestreamChannelId, (state) => {
      setIsBroadcasting(state);
    });
  }, [livestreamChannelId, setIsBroadcasting]);

  const [release, setRelease] = React.useState(
    window.releae_time || moment(Number(claim.value.release_time || 0) * 1000)
  );
  // const release = moment(Number(claim.value.release_time * 1000));

  // @todo: testing
  window.moment = moment;
  window.releaseTime = (r) => {
    window.releae_time = r;
    setRelease(r);
    console.info('::: set release time to: ', release);
  };
  // -----------------------------

  const claimReleaseInFuture = () => release.isAfter(moment());

  const claimReleaseInPast = () => release.isBefore(moment());

  const claimReleaseStartingSoon = () => release.isBetween(moment(), moment().add(5, 'minutes'));

  const claimReleaseStartedRecently = () => release.isBetween(moment().subtract(5, 'minutes'), moment());

  const checkShowLivestream = () => isBroadcasting && (claimReleaseInPast() || claimReleaseStartingSoon());

  const checkShowScheduledInfo = () =>
    (!isBroadcasting && claimReleaseInFuture()) ||
    (!isBroadcasting && claimReleaseStartedRecently()) ||
    (isBroadcasting && claimReleaseInFuture() && !claimReleaseStartingSoon());

  const checkCommentsDisabled = () =>
    chatDisabled ||
    (isBroadcasting && !claimReleaseStartingSoon() && !claimReleaseInPast()) ||
    (!isBroadcasting && claimReleaseInFuture());

  const [showLivestream, setShowLivestream] = React.useState(checkShowLivestream());
  const [showScheduledInfo, setShowScheduledInfo] = React.useState(checkShowScheduledInfo());
  const [hideComments, setHideComments] = React.useState(checkCommentsDisabled());

  const calculateStreamReleaseState = () => {
    setShowLivestream(checkShowLivestream());
    setShowScheduledInfo(checkShowScheduledInfo());
    setHideComments(checkCommentsDisabled());
  };

  React.useEffect(() => {
    const interval = setInterval(calculateStreamReleaseState, 1000);
    return () => clearInterval(interval);
  }, [release, isBroadcasting]);

  const stringifiedClaim = JSON.stringify(claim);
  React.useEffect(() => {
    if (uri && stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);

      if (jsonClaim) {
        const { txid, nout, claim_id: claimId } = jsonClaim;
        const outpoint = `${txid}:${nout}`;

        analytics.apiLogView(uri, outpoint, claimId);
      }

      if (!isAuthenticated) {
        const uri = jsonClaim.signing_channel && jsonClaim.signing_channel.permanent_url;
        if (uri) {
          doUserSetReferrer(uri.replace('lbry://', ''));
        }
      }
    }
  }, [uri, stringifiedClaim, isAuthenticated]);

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    // This can be removed when we start using the app video player, not a LIVESTREAM iframe
    doSetPlayingUri({ uri: null });
  }, [doSetPlayingUri]);

  return (
    isBroadcasting !== 'pending' && (
      <Page
        className="file-page"
        noFooter
        livestream
        chatDisabled={hideComments}
        rightSide={!hideComments && <LivestreamComments uri={uri} />}
      >
        <LivestreamLayout
          uri={uri}
          hideComments={hideComments}
          release={release}
          isBroadcasting={isBroadcasting}
          showLivestream={showLivestream}
          showScheduledInfo={showScheduledInfo}
        />
      </Page>
    )
  );
}
