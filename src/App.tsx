import * as React from 'react';
import './App.css';

interface TodoOwnProps {
  onClick: () => void;
}

interface TodoState {
  id: number;
  text: string;
  done: boolean;
}

type TodoProps = TodoOwnProps & TodoState;

class Todo extends React.Component<TodoProps> {
  render() {
    return (
      <span className={this.props.done ? 'done' : ''} onClick={this.props.onClick}>
        {this.props.text}
      </span>
    );
  }
}

interface TodoListProps {
  todos: TodoState[];
  onClickTodo: (id: number) => () => void;
  onClickTodoDelete: (id: number) => () => void;
}

class TodoList extends React.Component<TodoListProps> {
  render () {
    return (
      <table>
        {this.props.todos.map((todo) => (
          <tr>
            <td>
              <Todo
                key={todo.id}
                {...todo}
                onClick={this.props.onClickTodo(todo.id)}
              />
            </td>
            <td>
              <button onClick={this.props.onClickTodoDelete(todo.id)}>x</button>
            </td>
          </tr>
        ))}
      </table>
    );
  }
}

interface AppLocalState {
  todos: TodoState[];
  newTodoText: string;
  nextId: number;
}

class App extends React.Component<{}, AppLocalState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      todos: [],
      newTodoText: '',
      nextId: 0,
    };
  }

  newTodo = (text: string) => {
    this.setState((state) => ({
      todos: [
        ...state.todos,
        {
          id: this.state.nextId,
          text,
          done: false,
        }
      ],
      newTodoText: '',
      nextId: state.nextId + 1,
    }));
  }

  toggleTodoDone = (id: number) => {
    this.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? {
          ...todo,
          done: !todo.done,
        } : todo),
    }));
  }

  deleteTodo = (id: number) => {
    this.setState((state) => ({
      todos: state.todos.filter((todo) =>
        todo.id !== id),
    }));
  }

  onChangeNewTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTodoText = e.target.value;
    this.setState((state) => ({newTodoText}));
  }

  onClickNewTodoButton = () => {
    if (this.state.newTodoText.length > 0) {
      this.newTodo(this.state.newTodoText);
    }
  }
  
  onKeyDownNewTodoInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.state.newTodoText.length > 0) {
      this.newTodo(this.state.newTodoText);
    }
  }

  onClickTodo = (id: number) => () => {
    this.toggleTodoDone(id);
  }

  onClickTodoDelete = (id: number) => () => {
    this.deleteTodo(id);
  }

  render() {
    return (
      <div>
        <input
          value={this.state.newTodoText}
          onChange={this.onChangeNewTodoInput}
          onKeyDown={this.onKeyDownNewTodoInput}
        />
        <button onClick={this.onClickNewTodoButton}>+</button>
        <TodoList
          todos={this.state.todos}
          onClickTodo={this.onClickTodo}
          onClickTodoDelete={this.onClickTodoDelete}
        />
      </div>
    );
  }
}

export default App;
