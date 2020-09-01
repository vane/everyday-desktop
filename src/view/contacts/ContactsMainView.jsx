import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

class ContactsMainView extends React.Component {
  handleAddressClick = () => {
    console.log('address click');
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.handleAddressClick}>
          <FontAwesomeIcon icon={faAddressBook} />
        </button>
      </div>
    );
  }
}

export default ContactsMainView;
