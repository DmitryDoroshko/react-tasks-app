import React, {useEffect, useState} from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import {FIREBASE_TASK_URL, FIREBASE_TASK_URL_MINIFIED} from "./utils/magic-strings";
import useHttp from "./hooks/use-http";
import Card from "./components/UI/Card/Card";
import EditTaskForm from "./components/EditTask/EditTaskForm/EditTaskForm";

function App() {
  const {isLoading, error, sendRequest: sendFetchTasksRequest} = useHttp();
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const applyTasks = (dataTasks) => {
    const loadedTasks = [];

    for (const taskKey in dataTasks) {
      loadedTasks.push({id: taskKey, text: dataTasks[taskKey].text});
    }

    setTasks(loadedTasks);
  };

  const fetchTasksHandler = async () => {
    await sendFetchTasksRequest({url: FIREBASE_TASK_URL}, applyTasks);
  };

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  const editTaskHandler = async (idOfTaskBeingEdited, newTaskData) => {
    setIsEditing(true);
    const taskExistingId = tasks.findIndex(task => {
      return task.id === idOfTaskBeingEdited;
    });

    if (!taskExistingId) {
      return;
    }

    console.log("tasks", tasks);

    console.log("New task data", newTaskData);

    const response = await fetch(FIREBASE_TASK_URL, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [idOfTaskBeingEdited.toString()]:
          {text: newTaskData}
      })
    });

    console.log("Response", response);

    if (!response.ok) {
      throw new Error("Something went terribly wrong!");
    }

    const json = await response.json();
    console.log(json);

    setIsEditing(false);
  };

  const deleteTaskHandler = async (taskId) => {
    const response = await fetch(`${FIREBASE_TASK_URL_MINIFIED}/${taskId}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskId),
    });

    if (!response.ok) {
      throw new Error("Not able to delete the task...");
    }

    setTasks(prevTasks => {
      return prevTasks.filter(prevTask => {
        return prevTask.id !== taskId;
      })
    });
  };

  const startEditingHandler = (idOfTaskBeingEdited, textOfTaskBeingEdited) => {
    setIsEditing(true);
    setEditingTaskId(idOfTaskBeingEdited);
    setEditingTaskText(textOfTaskBeingEdited);
  };

  const cancelEditingHandler = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  // Fetch tasks on the first run
  useEffect(() => {
    sendFetchTasksRequest({url: FIREBASE_TASK_URL}, applyTasks);
  }, []);

  // If editingTaskId changes, do the following:
  // Find editing task id, set editing task text, and set isEditing to true
  useEffect(() => {
    if (!isEditing) return;

    const fetchData = async () => {
      const response = await fetch(FIREBASE_TASK_URL);
      const jsonData = await response.json();
      const loadedTasks = [];

      for (const taskKey in jsonData) {
        loadedTasks.push({id: taskKey, text: jsonData[taskKey].text});
      }

      const taskExisting = loadedTasks.find(task => {
        return task.id === editingTaskId;
      });

      if (!taskExisting) {
        return;
      }
      setEditingTaskId(taskExisting.id);
      setEditingTaskText(taskExisting.text);
      setIsEditing(true);
    };

    fetchData();
  }, [editingTaskId, isEditing]);

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler}/>
      {isEditing && <Card>
        <EditTaskForm
          onEditCancel={cancelEditingHandler}
          onEditTask={editTaskHandler}
          taskId={editingTaskId}
          taskText={editingTaskText}
        />
      </Card>}
      {!isLoading && <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onEdit={startEditingHandler}
        onFetch={fetchTasksHandler}
        onDelete={deleteTaskHandler}
        onEditCancel={cancelEditingHandler}
      />}
    </React.Fragment>
  );
}

export default App;
