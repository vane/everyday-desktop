import React from 'react';
import NotesAddButton from './NotesAddButton';
import NotesList from './NotesList';

class NotesMainView extends React.Component {
  render() {
    return (
      <div>
        <NotesAddButton />
        <button type="button" onClick={this.handleSayTest}>Say Test</button>
        <NotesList />
      </div>
    );
  }
}

export default NotesMainView;
