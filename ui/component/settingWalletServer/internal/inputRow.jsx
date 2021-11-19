// @flow
import { Form, FormField } from 'component/common/form';
import * as REGEX from 'constants/regex';
import Button from 'component/button';
import React, { useState, useEffect } from 'react';

type Props = {
  update: ([string, string]) => void,
};

function ServerInputRow(props: Props) {
  const { update } = props;
  const [hostString, setHostString] = useState('');
  const [portString, setPortString] = useState('');
  const [validServerString, setValidServerString] = useState(false);

  useEffect(() => {
    setValidServerString(
      (REGEX.VALID_IPADDRESS.test(hostString) || REGEX.VALID_HOSTNAME.test(hostString)) &&
        REGEX.VALID_PORT.test(portString)
    );
  }, [hostString, portString, validServerString, setValidServerString]);

  function onSubmit() {
    update([hostString, portString]);
    setHostString('');
    setPortString('');
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="section__actions">
        <FormField
          type="text"
          label={__('Host')}
          placeholder={'code.freezepeach.fun'}
          value={hostString}
          onChange={(e) => setHostString(e.target.value)}
        />
        <span className="form-field__conjuction">:</span>
        <FormField
          type="number"
          label={__('Port')}
          placeholder={'50001'}
          value={portString}
          onChange={(e) => setPortString(String(e.target.value))}
        />
      </div>

      <div className="section__actions">
        <Button type="submit" button="primary" label={__('Add')} disabled={!validServerString} />
      </div>
    </Form>
  );
}

export default ServerInputRow;
