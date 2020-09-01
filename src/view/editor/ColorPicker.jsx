import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import AppEvent from '../../event';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '100',
      },
    };
  }

  handleClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb });
    const { uid } = this.props;
    new AppEvent(`text.editor.color.change.${uid}`, color.hex).dispatch();
  };

  render() {
    const { displayColorPicker, color } = this.state;
    const styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    let expand = null;
    if (displayColorPicker) {
      expand = (
        <div style={styles.popover}>
          <div role="presentation" style={styles.cover} onClick={this.handleClose} />
          <SketchPicker color={color} onChange={this.handleChange} />
        </div>
      );
    }
    return (
      <div>
        <div role="presentation" style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        { expand }
      </div>
    );
  }
}

export default ColorPicker;
