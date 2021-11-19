// @flow
import { ComboboxOption, ComboboxOptionText } from '@reach/combobox';
import ChannelThumbnail from 'component/channelThumbnail';
import React from 'react';

type Props = {
  claim?: Claim,
  emote?: any,
  isResolvingUri: boolean,
  uri?: string,
};

export default function TextareaSuggestionsItem(props: Props) {
  const { claim, emote, isResolvingUri, uri } = props;

  if (!claim && !emote) return null;

  if (emote) {
    const { name, url } = emote;

    return (
      <ComboboxOption value={name.toLowerCase()}>
        <div className="textareaSuggestion--emote">
          <img src={url} />

          <div className="textareaSuggestion__label">
            <span className="textareaSuggestion__title textareaSuggestion__value">
              <ComboboxOptionText />
            </span>
          </div>
        </div>
      </ComboboxOption>
    );
  }

  if (isResolvingUri) {
    return (
      <div className="textareaSuggestion">
        <div className="media__thumb media__thumb--resolving" />
      </div>
    );
  }

  if (claim) {
    const canonicalMention = claim.canonical_url.replace('lbry://', '').replace('#', ':');

    return (
      <ComboboxOption value={canonicalMention}>
        <div className="textareaSuggestion">
          <ChannelThumbnail xsmall uri={uri} />

          <div className="textareaSuggestion__label">
            <span className="textareaSuggestion__title">
              {(claim.value && claim.value.title) || <ComboboxOptionText />}
            </span>
            <span className="textareaSuggestion__value">
              <ComboboxOptionText />
            </span>
          </div>
        </div>
      </ComboboxOption>
    );
  }
}
