// @flow

import React from 'react';
import { SITE_HELP_EMAIL } from 'config';
import Button from 'component/button';
import { killStream } from '$web/src/livestreaming';
import watchLivestreamStatus from '$web/src/livestreaming/long-polling';
import 'scss/component/claim-preview-reset.scss';

type Props = {
  channelId: string,
  channelName: string,
  claimIsMine: boolean,
  doToast: ({ message: string, isError?: boolean }) => void,
};

const ClaimPreviewReset = (props: Props) => {
  const { channelId, channelName, claimIsMine, doToast } = props;

  const [isLivestreaming, setIsLivestreaming] = React.useState(false);

  React.useEffect(() => {
    if (!claimIsMine) {
      return;
    }
    return watchLivestreamStatus(channelId, (state) => setIsLivestreaming(state));
  }, [channelId, setIsLivestreaming, claimIsMine]);

  if (!claimIsMine || !isLivestreaming) return null;

  const handleClick = async () => {
    try {
      await killStream(channelId, channelName);
      doToast({ message: __('Live stream successfully reset.'), isError: false });
    } catch {
      doToast({ message: __('There was an error resetting the live stream.'), isError: true });
    }
  };

  return (
    <p className={'claimPreviewReset'}>
      <span className={'claimPreviewReset__hint'}>
        {__(
          "If you're having trouble starting a stream or if your stream shows that you're live but aren't, try a reset. If the problem persists, please reach out at %SITE_HELP_EMAIL%.",
          { SITE_HELP_EMAIL }
        )}
      </span>
      <Button
        button="primary"
        label={__('Reset stream')}
        className={'claimPreviewReset__button'}
        onClick={handleClick}
      />
    </p>
  );
};

export default ClaimPreviewReset;
