import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

class EmailMainView extends React.Component {
  handleCheckEmail = () => {
    console.log('check for email');
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.handleCheckEmail}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </div>
    );
  }
}

export default EmailMainView;
