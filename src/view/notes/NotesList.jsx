import React from 'react';
import { noteGet } from './NotesModel';
import AppEvent from '../../event';
import NoteListItem from './NoteListItem';

const notesListStyles = {
  overflow: 'auto',
  height: '60vh',
};

class NotesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: noteGet(),
    };
  }

  componentDidMount() {
    AppEvent.listen('note.add', this.handleNoteAdd);
    AppEvent.listen('note.update', this.handleNoteAdd);
  }

  componentWillUnmount() {
    AppEvent.remove('note.add', this.handleNoteAdd);
    AppEvent.remove('note.update', this.handleNoteAdd);
  }

  handleNoteAdd = () => {
    this.setState({ notes: noteGet() });
    console.log('state change');
  }

  render() {
    const notesList = [];
    const { notes } = this.state;
    notes.forEach((el) => {
      notesList.push(<NoteListItem key={el.id} note={el} />);
    });
    return (
      <div style={notesListStyles}>
        {notesList}
      </div>
    );
  }
}

export default NotesList;
