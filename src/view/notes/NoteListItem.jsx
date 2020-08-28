import React from 'react';
import NoteState from './NoteState';
import NoteEditView from './NoteEditView';
import NoteView from './NoteView';

class NoteListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.note;
  }

  render() {
    const el = this.state;
    if (el.state === NoteState.EDIT) {
      return <NoteEditView note={el} />;
    }
    return <NoteView note={el} />;
  }
}

export default NoteListItem;
