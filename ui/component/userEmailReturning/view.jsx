// @flow
import { FormField, Form } from 'component/common/form';
import { SITE_NAME, SIMPLE_SITE } from 'config';
import { useHistory } from 'react-router-dom';
import * as PAGES from 'constants/pages';
import * as REGEX from 'constants/regex';
import Button from 'component/button';
import Card from 'component/common/card';
import classnames from 'classnames';
import LoginGraphic from 'component/loginGraphic';
import Nag from 'component/common/nag';
import React, { useState } from 'react';
import UserEmailVerify from 'component/userEmailVerify';

type Props = {
  emailDoesNotExist: boolean,
  emailToVerify: ?string,
  errorMessage: ?string,
  isPending: boolean,
  user: ?User,
  doClearEmailEntry: () => void,
  doSetClientSetting: (string, boolean, ?boolean) => void,
  doSetWalletSyncPreference: (boolean) => void,
  doUserCheckIfEmailExists: (string) => void,
  doUserSignIn: (string, ?string) => void,
};

function UserEmailReturning(props: Props) {
  const {
    emailDoesNotExist,
    emailToVerify,
    errorMessage,
    isPending,
    user,
    doClearEmailEntry,
    doSetWalletSyncPreference,
    doUserCheckIfEmailExists,
  } = props;

  const { push, location } = useHistory();

  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const emailExistsFromUrl = urlParams.get('email_exists');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const hasPasswordSet = user && user.password_set;

  const [email, setEmail] = useState(defaultEmail);
  const [syncEnabled] = useState(true);

  const valid = email.match(REGEX.EMAIL);
  const showEmailVerification = emailToVerify || hasPasswordSet;

  function handleSubmit() {
    doSetWalletSyncPreference(syncEnabled);
    doUserCheckIfEmailExists(email);
  }

  function handleChangeToSignIn() {
    doClearEmailEntry();
    let url = `/$/${PAGES.AUTH}`;
    const urlParams = new URLSearchParams(location.search);

    urlParams.delete('email_exists');
    urlParams.delete('email');
    if (email) {
      urlParams.set('email', encodeURIComponent(email));
    }

    push(`${url}?${urlParams.toString()}`);
  }

  return (
    <div
      className={classnames('main__sign-in', {
        'main__sign-up--graphic': SIMPLE_SITE && !showEmailVerification,
      })}
    >
      {showEmailVerification ? (
        <UserEmailVerify />
      ) : (
        <Card
          title={__('Log in to %SITE_NAME%', { SITE_NAME })}
          actions={
            <div>
              <Form onSubmit={handleSubmit} className="section">
                <FormField
                  autoFocus={!emailExistsFromUrl}
                  placeholder={__('yourstruly@example.com')}
                  type="email"
                  id="username"
                  autoComplete="on"
                  name="sign_in_email"
                  label={__('Email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="section__actions">
                  <Button
                    autoFocus={emailExistsFromUrl}
                    button="primary"
                    type="submit"
                    label={__('Log In')}
                    disabled={!email || !valid || isPending}
                  />
                  <Button button="link" onClick={handleChangeToSignIn} label={__('Sign Up')} />
                </div>
              </Form>
            </div>
          }
          nag={
            <>
              {!emailDoesNotExist && emailExistsFromUrl && (
                <Nag type="helpful" relative message={__('That email is already in use. Did you mean to log in?')} />
              )}
              {emailDoesNotExist && (
                <Nag
                  type="helpful"
                  relative
                  message={__("We can't find that email. Did you mean to sign up?")}
                  actionText={__('Sign Up')}
                />
              )}
              {!emailExistsFromUrl && !emailDoesNotExist && errorMessage && (
                <Nag type="error" relative message={errorMessage} />
              )}
            </>
          }
          secondPane={SIMPLE_SITE && <LoginGraphic />}
        />
      )}
    </div>
  );
}

export default UserEmailReturning;
