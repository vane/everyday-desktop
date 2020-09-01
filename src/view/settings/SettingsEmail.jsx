import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

class SettingsEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'view',
    };
  }
  handleAddClick = () => {

  }
  render() {
    const addEmail = null;
    return (
      <div>
        <button type="button" onClick={this.handleAddClick}>+</button>
      </div>
    );
  }
}
