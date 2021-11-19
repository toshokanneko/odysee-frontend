// @flow
import { Form, FormField } from 'component/common/form';
import { useHistory } from 'react-router-dom';
import * as PAGES from 'constants/pages';
import * as REGEX from 'constants/regex';
import Button from 'component/button';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import Nag from 'component/common/nag';
import React from 'react';
import Spinner from 'component/spinner';

type Props = {
  emailToVerify: ?string,
  passwordResetError: ?string,
  passwordResetPending: boolean,
  passwordResetSuccess: boolean,
  user: ?User,
  doToast: ({ message: string }) => void,
  doUserPasswordReset: (string) => void,
  doClearPasswordEntry: () => void,
  doClearEmailEntry: () => void,
};

function UserPasswordReset(props: Props) {
  const {
    emailToVerify,
    passwordResetError,
    passwordResetPending,
    passwordResetSuccess,
    doClearEmailEntry,
    doClearPasswordEntry,
    doToast,
    doUserPasswordReset,
  } = props;

  const { location, push, goBack } = useHistory();

  const [email, setEmail] = React.useState(emailToVerify || '');

  const valid = email.match(REGEX.EMAIL);
  const restartAtSignInPage = location.pathname === `/$/${PAGES.AUTH_SIGNIN}`;

  function handleSubmit() {
    if (email) {
      doUserPasswordReset(email);
    }
  }

  function handleRestart() {
    setEmail('');
    doClearPasswordEntry();
    doClearEmailEntry();
    if (restartAtSignInPage) {
      push(`/$/${PAGES.AUTH_SIGNIN}`);
    } else {
      goBack();
    }
  }

  React.useEffect(() => {
    if (passwordResetSuccess) {
      doToast({
        message: __('Email sent!'),
      });
    }
  }, [passwordResetSuccess, doToast]);

  return (
    <section className="main__sign-in">
      <Card
        title={__('Reset your password')}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                disabled={passwordResetSuccess}
                placeholder={__('yourstruly@example.com')}
                type="email"
                name="sign_in_email"
                id="username"
                autoComplete="on"
                label={__('Email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="section__actions">
                <Button
                  button="primary"
                  type="submit"
                  label={passwordResetPending ? __('Resetting') : __('Reset Password')}
                  disabled={!email || !valid || passwordResetPending || passwordResetSuccess}
                />
                <Button button="link" label={__('Cancel')} onClick={handleRestart} />
                {passwordResetPending && <Spinner type="small" />}
              </div>
            </Form>
          </div>
        }
        nag={
          <>
            {passwordResetError && <Nag type="error" relative message={<ErrorText>{passwordResetError}</ErrorText>} />}
            {passwordResetSuccess && (
              <Nag type="helpful" relative message={__('Check your email for a link to reset your password.')} />
            )}
          </>
        }
      />
    </section>
  );
}

export default UserPasswordReset;
