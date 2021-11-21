// @flow
import { FormField } from 'component/common/form';
import { generateEmbedUrl } from 'util/web';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import React, { useRef } from 'react';

type Props = {
  claim: Claim,
  includeStartTime: boolean,
  label?: string,
  referralCode: ?string,
  startTime: number,
  doToast: ({ message: string }) => void,
};

export default function EmbedTextArea(props: Props) {
  const { claim, includeStartTime, label, referralCode, startTime, doToast } = props;
  const { claim_id: claimId, name } = claim;
  const input = useRef();

  const streamUrl = generateEmbedUrl(name, claimId, includeStartTime, startTime, referralCode);
  let embedText = `<iframe id="lbry-iframe" width="560" height="315" src="${streamUrl}" allowfullscreen></iframe>`;

  function copyToClipboard() {
    const topRef = input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
      document.execCommand('copy');
      doToast({ message: 'Embed link copied' });
    }
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input && input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
    }
  }

  return (
    <div className="section">
      <FormField
        type="textarea"
        className="form-field--copyable"
        label={label}
        value={embedText || ''}
        ref={input}
        onFocus={onFocus}
        readOnly
      />

      <div className="section__actions">
        <Button icon={ICONS.COPY} button="secondary" label={__('Copy')} onClick={copyToClipboard} />
      </div>
    </div>
  );
}
