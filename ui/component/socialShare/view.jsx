// @flow
import { FormField } from 'component/common/form';
import { generateDownloadUrl } from 'util/web';
import { generateLbryContentUrl, generateLbryWebUrl, generateEncodedLbryURL, generateShareUrl } from 'util/url';
import { hmsToSeconds, secondsToHms } from 'util/time';
import { URL, TWITTER_ACCOUNT, SHARE_DOMAIN_URL } from 'config';
import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import EmbedTextArea from 'component/embedTextArea';
import React from 'react';

const SHARE_DOMAIN = SHARE_DOMAIN_URL || URL;
const IOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const SUPPORTS_SHARE_API = typeof navigator.share !== 'undefined';

type Props = {
  claim: StreamClaim,
  title: ?string,
  webShareable: boolean,
  referralCode: string,
  user: any,
  position: number,
  collectionId?: number,
};

function SocialShare(props: Props) {
  const { claim, title, referralCode, user, webShareable, position, collectionId } = props;
  const [showEmbed, setShowEmbed] = React.useState(false);
  const [includeCollectionId, setIncludeCollectionId] = React.useState(Boolean(collectionId)); // unless it *is* a collection?
  const [showClaimLinks, setShowClaimLinks] = React.useState(false);
  const [includeStartTime, setincludeStartTime]: [boolean, any] = React.useState(false);
  const [startTime, setStartTime]: [string, any] = React.useState(secondsToHms(position));
  const startTimeSeconds: number = hmsToSeconds(startTime);
  const isMobile = useIsMobile();

  if (!claim) return null;

  const { canonical_url: canonicalUrl, permanent_url: permanentUrl, name, claim_id: claimId } = claim;
  const isChannel = claim.value_type === 'channel';
  const isCollection = claim.value_type === 'collection';
  const isStream = claim.value_type === 'stream';
  const isVideo = isStream && claim.value.stream_type === 'video';
  const isAudio = isStream && claim.value.stream_type === 'audio';
  const showStartAt = isVideo || isAudio;
  const rewardsApproved = user && user.is_reward_approved;
  const lbryUrl: string = generateLbryContentUrl(canonicalUrl, permanentUrl);
  const lbryWebUrl: string = generateLbryWebUrl(lbryUrl);
  const includedCollectionId = collectionId && includeCollectionId ? collectionId : null;
  const encodedLbryURL: string = generateEncodedLbryURL(
    SHARE_DOMAIN,
    lbryWebUrl,
    includeStartTime,
    startTimeSeconds,
    includedCollectionId
  );
  const shareUrl: string = generateShareUrl(
    SHARE_DOMAIN,
    lbryUrl,
    referralCode,
    rewardsApproved,
    includeStartTime,
    startTimeSeconds,
    includedCollectionId
  );
  const downloadUrl = `${generateDownloadUrl(name, claimId)}`;

  // Tweet params
  let tweetIntentParams = {
    url: shareUrl,
    text: title || claim.name,
    hashtags: 'LBRY,Odysee',
    via: TWITTER_ACCOUNT || undefined,
  };

  function handleWebShareClick() {
    if (navigator.share) {
      navigator.share({
        title: title || claim.name,
        url: window.location.href,
      });
    }
  }

  const getShareButton = (icon: string, title: string, href: string) => (
    <Button className="share" iconSize={24} icon={icon} title={title} href={href} />
  );

  return (
    <>
      <CopyableText copyable={shareUrl} />
      {showStartAt && (
        <div className="section__checkbox">
          <FormField
            type="checkbox"
            name="share_start_at_checkbox"
            onChange={() => setincludeStartTime(!includeStartTime)}
            checked={includeStartTime}
            label={__('Start at')}
          />
          <FormField
            type="text"
            name="share_start_at"
            value={startTime}
            disabled={!includeStartTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </div>
      )}
      {Boolean(collectionId) && (
        <div className="section__checkbox">
          <FormField
            type="checkbox"
            name="share_collection_id_checkbox"
            onChange={() => setIncludeCollectionId(!includeCollectionId)}
            checked={includeCollectionId}
            label={__('Include List ID')}
          />
        </div>
      )}
      <div className="section__actions">
        {getShareButton(
          ICONS.TWITTER,
          __('Share on Twitter'),
          `https://twitter.com/intent/tweet?${new URLSearchParams(tweetIntentParams).toString()}`
        )}
        {getShareButton(ICONS.REDDIT, __('Share on Reddit'), `https://reddit.com/submit?url=${encodedLbryURL}`)}
        {/* Only ios client supports share urls */}
        {IOS &&
          getShareButton(ICONS.TELEGRAM, __('Share on Telegram'), `tg://msg_url?url=${encodedLbryURL}&amp;text=text`)}
        {getShareButton(
          ICONS.LINKEDIN,
          __('Share on LinkedIn'),
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLbryURL}`
        )}
        {getShareButton(
          ICONS.FACEBOOK,
          __('Share on Facebook'),
          `https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`
        )}

        {webShareable && !isCollection && !isChannel && (
          <Button
            className="share"
            iconSize={24}
            icon={ICONS.EMBED}
            title={__('Embed this content')}
            onClick={() => {
              setShowEmbed(!showEmbed);
              setShowClaimLinks(false);
            }}
          />
        )}
        <Button
          className="share"
          iconSize={24}
          icon={ICONS.SHARE_LINK}
          title={__('Links')}
          onClick={() => {
            setShowClaimLinks(!showClaimLinks);
            setShowEmbed(false);
          }}
        />
      </div>

      {SUPPORTS_SHARE_API && isMobile && (
        <div className="section__actions">
          <Button icon={ICONS.SHARE} button="primary" label={__('Share via...')} onClick={handleWebShareClick} />
        </div>
      )}
      {showEmbed && (
        <EmbedTextArea
          label={__('Embedded')}
          claim={claim}
          includeStartTime={includeStartTime}
          startTime={startTimeSeconds}
          referralCode={referralCode}
        />
      )}
      {showClaimLinks && (
        <div className="section">
          <CopyableText label={__('LBRY URL')} copyable={`lbry://${lbryUrl}`} />
          {Boolean(isStream) && <CopyableText label={__('Download Link')} copyable={downloadUrl} />}
        </div>
      )}
    </>
  );
}

export default SocialShare;
