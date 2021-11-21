// @flow
import { formatLbryUrlForWeb } from 'util/url';
import { SITE_NAME } from 'config';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Card from 'component/common/card';
import classnames from 'classnames';
import FileRender from 'component/fileRender';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import React, { useEffect } from 'react';
import Spinner from 'component/spinner';

type Props = {
  blackListedOutpoints: Array<{ txid: string, nout: number }>,
  claim: Claim,
  costInfo: any,
  isResolvingUri: boolean,
  streamingUrl: string,
  uri: string,
  fetchCostInfoForUri: (string) => void,
  playUri: (string) => void,
  resolveUri: (string) => void,
};

export const EmbedContext = React.createContext<any>();
const EmbedWrapperPage = (props: Props) => {
  const {
    blackListedOutpoints,
    claim,
    costInfo,
    isResolvingUri,
    streamingUrl,
    uri,
    fetchCostInfoForUri,
    playUri,
    resolveUri,
  } = props;

  const {
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const embedLightBackground = urlParams.get('embedBackgroundLight');
  const readyToDisplay = claim && streamingUrl;
  const loading = !claim && isResolvingUri;
  const noContentFound = !claim && !isResolvingUri;
  const isPaidContent = costInfo && costInfo.cost > 0;
  const contentLink = formatLbryUrlForWeb(uri);
  const signingChannel = claim && claim.signing_channel;
  const isClaimBlackListed =
    claim &&
    blackListedOutpoints &&
    blackListedOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );

  useEffect(() => {
    if (!uri) return;

    if (!claim && resolveUri) {
      resolveUri(uri);
    } else if (costInfo && costInfo.cost === 0) {
      playUri(uri);
    } else if (fetchCostInfoForUri) {
      fetchCostInfoForUri(uri);
    }
  }, [claim, costInfo, fetchCostInfoForUri, playUri, resolveUri, uri]);

  return isClaimBlackListed ? (
    <Card
      title={uri}
      subtitle={__(
        'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this content from our applications.'
      )}
      actions={
        <div className="section__actions">
          <Button button="link" href="https://https://odysee.com/@OdyseeHelp:b/copyright:f" label={__('Read More')} />
        </div>
      }
    />
  ) : (
    <div
      className={classnames('embed__wrapper', {
        'embed__wrapper--light-background': embedLightBackground,
      })}
    >
      <EmbedContext.Provider value>
        {readyToDisplay ? (
          <FileRender uri={uri} embedded />
        ) : (
          <div className="embed__loading">
            <FileViewerEmbeddedTitle uri={uri} />

            <div className="embed__loading-text">
              {loading && <Spinner delayed light />}
              {noContentFound && <h1>{__('No content found.')}</h1>}
              {isPaidContent && (
                <div>
                  <h1>{__('Paid content cannot be embedded.')}</h1>
                  <div className="section__actions--centered">
                    <Button label={__('Watch on %SITE_NAME%', { SITE_NAME })} button="primary" href={contentLink} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </EmbedContext.Provider>
    </div>
  );
};

export default EmbedWrapperPage;
