import React from 'react';
import NotesAddButton from './NotesAddButton';
import NotesList from './NotesList';

const NotesMainView = () => (
  <div>
    <NotesAddButton />
    <NotesList />
  </div>
);

export default NotesMainView;
