import React from 'react';

import { getTodoList, addTodoListItem } from "../../Data/todo";

import UserContext from '../../Contexts/UserContext';

const Todo = props => {
  const [todoList, setTodoList] = React.useState([]);
  const [newItem, setNewItem] = React.useState('');
  const {user} = React.useContext(UserContext);

  React.useEffect(() => {
    getTodoList(setTodoList, user);
  }, []);

  const updateNewItem = event => {
    setNewItem(event.target.value);
  };

  const submitNewItem = event => {
    if (event.code === "Enter") {
      if (user.token) {
        addTodoListItem(setTodoList, newItem, user);
        setNewItem('');
      }
    }
  };

  return (
    <div className="content">
      <div className="container">
        <h1>Todo</h1>
        <ul className="stars">
          {user.token && (
            <li key={"new"}>
              <input
                className="input"
                type="text"
                name="newTodoItem"
                placeholder="New item (press return to add)"
                value={newItem}
                onChange={e => updateNewItem(e)}
                onKeyDown={submitNewItem}
              />
            </li>
          )}
          {todoList.map(todo => (
            <li key={todo.id}>
            {todo.complete ? <s>{todo.item}</s> : todo.item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default Todo;
