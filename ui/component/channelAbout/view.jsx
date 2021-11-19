// @flow
import { SIMPLE_SITE } from 'config';
import * as PAGES from 'constants/pages';
import * as REGEX from 'constants/regex';
import Button from 'component/button';
import ClaimTags from 'component/claimTags';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import MarkdownPreview from 'component/common/markdown-preview';
import React from 'react';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import YoutubeBadge from 'component/youtubeBadge';

type Props = {
  claim: ChannelClaim,
  description: ?string,
  email: ?string,
  languages: Array<string>,
  uri: string,
  website: ?string,
};

function ChannelAbout(props: Props) {
  const { claim, uri, description, email, website, languages } = props;
  const claimId = claim && claim.claim_id;

  const formatEmail = (email: string) => {
    if (!email) return null;

    const protocol = REGEX.EMAIL_PROTOCOL.exec(email);
    return protocol ? email : `mailto:${email}`;
  };

  return (
    <div className="card">
      <section className="section card--section">
        {description && (
          <>
            <label>{__('Description')}</label>
            <div className="media__info-text media__info-text--constrained">
              <MarkdownPreview content={description} />
            </div>
          </>
        )}
        {email && (
          <>
            <label>{__('Contact')}</label>
            <div className="media__info-text">
              <MarkdownPreview content={formatEmail(email)} simpleLinks />
            </div>
          </>
        )}
        {website && (
          <>
            <label>{__('Site')}</label>
            <div className="media__info-text">
              <MarkdownPreview content={website} simpleLinks />
            </div>
          </>
        )}

        <label>{__('Tags')}</label>
        <div className="media__info-text">
          <ClaimTags uri={uri} type="large" />
        </div>

        <label>{__('Languages')}</label>
        <div className="media__info-text">
          {/* this could use some nice 'tags' styling */}
          {languages && languages.length
            ? languages.reduce((acc, lang, i) => {
                return acc + `${SUPPORTED_LANGUAGES[lang]}` + ' ';
              }, '')
            : null}
        </div>

        <label>{__('Total Uploads')}</label>
        <div className="media__info-text">{claim.meta.claims_in_channel}</div>

        <label>{__('Last Updated')}</label>
        <div className="media__info-text">
          <DateTime timeAgo uri={uri} />
        </div>

        <label>{__('URL')}</label>
        <div className="media__info-text">
          <div className="media__info-text media__info-text--constrained">{claim.canonical_url}</div>
        </div>

        <label>{__('Claim ID')}</label>
        <div className="media__info-text">
          <div className="media__info-text media__info-text--constrained">{claim.claim_id}</div>
        </div>

        <label>{__('Staked Credits')}</label>
        <div className="media__info-text">
          <CreditAmount
            badge={false}
            amount={parseFloat(claim.amount) + parseFloat(claim.meta.support_amount)}
            precision={8}
          />{' '}
          {SIMPLE_SITE && (
            <Button
              button="link"
              label={__('view other claims at lbry://%name%', {
                name: claim.name,
              })}
              navigate={`/$/${PAGES.TOP}?name=${claim.name}`}
            />
          )}
        </div>

        <YoutubeBadge channelClaimId={claimId} />
      </section>
    </div>
  );
}

export default ChannelAbout;
