// @flow
import * as React from 'react';
import Icon from 'component/common/icon';
import * as icons from 'constants/icons';

type Props = {
  message: string,
  details: ?string,
  isWarning: boolean,
};

class LoadScreen extends React.PureComponent<Props> {
  static defaultProps = {
    isWarning: false,
  };

  render() {
    const { details, message, isWarning } = this.props;

    return (
      <div className="load-screen">
        <div className="load-screen__header">
          <h1 className="load-screen__title">{__('LBRY')}</h1>
          <sup className="load-scree__beta">beta</sup>
        </div>
        {isWarning ? (
          <span className="load-screen__message">
            <Icon size={20} icon={icons.ALERT} />
            {` ${message}`}
          </span>
        ) : (
          <div className="load-screen__message">{message}</div>
        )}

        {details && <div className="load-screen__details">{details}</div>}
      </div>
    );
  }
}

export default LoadScreen;
