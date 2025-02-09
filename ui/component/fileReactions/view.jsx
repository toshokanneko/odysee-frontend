// @flow
import * as REACTION_TYPES from 'constants/reactions';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import RatioBar from 'component/ratioBar';
import { formatNumberWithCommas } from 'util/number';
import NudgeFloating from 'component/nudgeFloating';
import { SIMPLE_SITE } from 'config';

type Props = {
  claim: StreamClaim,
  doFetchReactions: (string) => void,
  doReactionLike: (string) => void,
  doReactionDislike: (string) => void,
  uri: string,
  likeCount: number,
  dislikeCount: number,
  myReaction: ?string,
  livestream?: boolean,
};

function FileReactions(props: Props) {
  const {
    claim,
    uri,
    doFetchReactions,
    doReactionLike,
    doReactionDislike,
    myReaction,
    likeCount,
    dislikeCount,
    livestream,
  } = props;

  const claimId = claim && claim.claim_id;
  const channel = claim && claim.signing_channel && claim.signing_channel.name;
  const isCollection = claim && claim.value_type === 'collection'; // hack because nudge gets cut off by card on cols.
  const likeIcon = SIMPLE_SITE ? (myReaction === REACTION_TYPES.LIKE ? ICONS.FIRE_ACTIVE : ICONS.FIRE) : ICONS.UPVOTE;
  const dislikeIcon = SIMPLE_SITE
    ? myReaction === REACTION_TYPES.DISLIKE
      ? ICONS.SLIME_ACTIVE
      : ICONS.SLIME
    : ICONS.DOWNVOTE;
  React.useEffect(() => {
    function fetchReactions() {
      doFetchReactions(claimId);
    }

    let fetchInterval;
    if (claimId) {
      fetchReactions();

      if (livestream) {
        fetchInterval = setInterval(fetchReactions, 45000);
      }
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [claimId, doFetchReactions, livestream]);

  return (
    <>
      {channel && !isCollection && (
        <NudgeFloating
          name="nudge:support-acknowledge"
          text={__('Let %channel% know you enjoyed this!', { channel })}
        />
      )}

      <div className={'ratio-wrapper'}>
        <Button
          title={__('I like this')}
          requiresAuth={IS_WEB}
          authSrc="filereaction_like"
          className={classnames('button--file-action button-like', {
            'button--fire': myReaction === REACTION_TYPES.LIKE,
          })}
          label={
            <>
              {myReaction === REACTION_TYPES.LIKE && SIMPLE_SITE && (
                <>
                  <div className="button__fire-glow" />
                  <div className="button__fire-particle1" />
                  <div className="button__fire-particle2" />
                  <div className="button__fire-particle3" />
                  <div className="button__fire-particle4" />
                  <div className="button__fire-particle5" />
                  <div className="button__fire-particle6" />
                </>
              )}
              {formatNumberWithCommas(likeCount, 0)}
            </>
          }
          iconSize={18}
          icon={likeIcon}
          onClick={() => doReactionLike(uri)}
        />
        <Button
          requiresAuth={IS_WEB}
          authSrc={'filereaction_dislike'}
          title={__('I dislike this')}
          className={classnames('button--file-action button-dislike', {
            'button--slime': myReaction === REACTION_TYPES.DISLIKE,
          })}
          label={
            <>
              {myReaction === REACTION_TYPES.DISLIKE && SIMPLE_SITE && (
                <>
                  <div className="button__slime-stain" />
                  <div className="button__slime-drop1" />
                  <div className="button__slime-drop2" />
                </>
              )}
              {formatNumberWithCommas(dislikeCount, 0)}
            </>
          }
          iconSize={18}
          icon={dislikeIcon}
          onClick={() => doReactionDislike(uri)}
        />
        <RatioBar likeCount={likeCount} dislikeCount={dislikeCount} />
      </div>
    </>
  );
}

export default FileReactions;
