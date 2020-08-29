import React from 'react';

class BrowserMainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://duck.com',
    };
  }

  handleOpenUrl =() => {
    const { url } = this.state;
    window.ctrl.openWebsite(url);
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="Type url here" onChange={(e) => this.setState({ url: e.target.value })} />
        <button type="button" onClick={this.handleOpenUrl}>Open</button>
      </div>
    );
  }
}

export default BrowserMainView;
