import React, {useState} from 'react';
import classes from "./EditTaskForm.module.css";

function EditTaskForm({onEditTask, taskText, taskId, onEditCancel}) {
  const [taskInputText, setTaskInputText] = useState(taskText || "");

  const taskInputTextChangeHandler = ({target: {value: inputValue}}) => {
    setTaskInputText(inputValue);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setTaskInputText("");
    onEditTask(taskId, taskInputText);
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div className={classes.form}>
        <div className={classes.controls}>
          <label htmlFor="edit-task-input">Edit task:</label>
          <input id="edit-task-input"
                 placeholder="Please enter task text"
                 onChange={taskInputTextChangeHandler}
                 value={taskInputText}
          />
        </div>
        <div className={classes.actions}>
          <button type="button"
                  className={classes.btnCancel}
                  onClick={onEditCancel}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
}

export default EditTaskForm;
