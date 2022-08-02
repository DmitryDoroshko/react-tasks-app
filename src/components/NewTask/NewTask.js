import Section from '../UI/Section';
import TaskForm from './TaskForm';
import useHttp from "../../hooks/use-http";
import {FIREBASE_TASK_URL} from "../../utils/magic-strings";

const NewTask = ({onAddTask}) => {
  const {isLoading, error, sendRequest: sendTaskRequest} = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name;
    const createdTask = {id: generatedId, text: taskText};
    onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    await sendTaskRequest({
      url: FIREBASE_TASK_URL,
      method: "POST",
      body: {text: taskText},
      headers: {"Content-Type": "application/json"}
    }, createTask.bind(null, taskText));
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading}/>
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
