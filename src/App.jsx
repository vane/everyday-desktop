import React from 'react';
import ReactDOM from 'react-dom';
import dateformat from 'dateformat'; // https://www.npmjs.com/package/dateformat
import NotesMainView from './view/notes/NotesMainView';
import BrowserMainView from './view/browser/BrowserMainView';
import SettingsMainView from './view/settings/SettingsMainView';

const containerStyle = {
  display: 'flex',
};

const sidebarStyle = {
  width: '150px',
  backgroundColor: 'red',
};

const sidebarMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: '1 0 auto',
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'notes',
    };
  }

  render() {
    const title = dateformat(Date.now(), 'dd mmmm yyyy'); //  hh:MM:ss Z
    const { state } = this.state;
    let component = null;
    switch (state) {
      case 'notes':
        component = <NotesMainView />;
        break;
      case 'browser':
        component = <BrowserMainView />;
        break;
      case 'settings':
        component = <SettingsMainView />;
        break;
      default:
        break;
    }
    return (
      <div style={containerStyle}>
        <div style={sidebarStyle}>
          <h3>{title}</h3>
          <div style={sidebarMenuStyle}>
            <button type="button" onClick={() => this.setState({ state: 'notes' })}>Notes</button>
            <button type="button" onClick={() => this.setState({ state: 'browser' })}>Browser</button>
            <hr style={{ width: '100%' }} />
            <button type="button" onClick={() => this.setState({ state: 'settings' })}>Settings</button>
          </div>
        </div>
        <div style={contentStyle}>
          {component}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
