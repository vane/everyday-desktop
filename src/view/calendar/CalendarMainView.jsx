import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

class CalendarMainView extends React.Component {
  handleCalendarClick = () => {
    console.log('calendar click');
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.handleCalendarClick}>
          <FontAwesomeIcon icon={faCalendar} />
        </button>
      </div>
    );
  }
}

export default CalendarMainView;
