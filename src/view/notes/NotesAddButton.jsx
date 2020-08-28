import React from 'react';
import { noteAdd } from './NotesModel';

const NotesAddButton = () => {
  const handleAddClick = () => {
    noteAdd('');
  };
  return <button type="button" onClick={handleAddClick}>+</button>;
};

export default NotesAddButton;
