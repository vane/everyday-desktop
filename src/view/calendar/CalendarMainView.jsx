import React from 'react';
import moment from 'moment';
import reactCSS from 'reactcss';
import * as BigCalendar from 'react-big-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const styles = reactCSS({
  default: {
    calendar: {
      height: '500px',
    },
  },
});
const localizer = BigCalendar.momentLocalizer(moment);

class CalendarMainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  handleCalendarClick = () => {
    console.log('calendar click');
  }

  handleSelect = ({ start, end }) => {
    const { events } = this.state;
    const title = window.prompt('New Event name');
    if (title) {
      this.setState({
        events: [
          ...events,
          {
            start,
            end,
            title,
          },
        ],
      });
    }
  }

  render() {
    const { events } = this.state;
    return (
      <div>
        <button type="button" onClick={this.handleCalendarClick}>
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <BigCalendar.Calendar
          selectable
          localizer={localizer}
          events={events}
          style={styles.calendar}
          defaultView={BigCalendar.Views.MONTH}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={(event) => alert(event.title)}
          onSelectSlot={this.handleSelect}
        />
      </div>
    );
  }
}

export default CalendarMainView;
