import { useEffect, useState } from 'react';
const api_base = 'http://localhost:3001';

function App() {

  //setting up State Vars
  const [todos, setTodos] = useState([]); //useState is a react Hook which I will use for State Management
  const [popupActive, setPopupActive] = useState(false); //for Pop Up State Management for adding tasks
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(api_base + '/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  }


  //function for completing Task on Todo
  const completeTodo = async id => {
    const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }

      return todo;
    }));

  }



  //function for adding Todo, the Modal type State
  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
  }



  //function to delete a task for our web app
  const deleteTodo = async id => {
    const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  };



  return (
    <div className="App">
      <h1>Welcome aboard!</h1>
      <h3>
        <i className="uil uil-clipboard-notes"></i> { }
        Your tasks:
      </h3>

      <div className="todos">
        {todos.length > 0 ? todos.map(todo => (
          <div className={
            "todo" + (todo.complete ? " is-complete" : "")
          } key={todo._id} onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>

            <div className="text">{todo.text}</div>

            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              <i className="uil uil-times"></i>
            </div>
          </div>
        )) : (
          <p>You currently have no tasks. <br></br>
            Please click on the Floating Button to add some new tasks.</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            <i className="uil uil-times"></i>
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

//code contributed by Ankit Deb 


export default App;

