import React from 'react';
import SpeechToText from '../../api/speechToText';

class SettingsMainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Ala ma kota!',
      language: 'pl',
    };
  }

  handleSay = () => {
    const { language, text } = this.state;
    SpeechToText.getInstance().read(language, text);
  }

  handleEmailSettings = () => {

  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <h1>Settings placeholder</h1>
        <input type="text" placeholder={text} onChange={(e) => this.setState({ text: e.target.value })} />
        <button type="button" onClick={this.handleSay}>Say</button>
        <button type="button" onClick={this.handleEmailSettings}>Email</button>
      </div>
    );
  }
}

export default SettingsMainView;
