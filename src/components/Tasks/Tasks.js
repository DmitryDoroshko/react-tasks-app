import Section from '../UI/Section';
import TaskItem from './TaskItem';
import classes from './Tasks.module.css';
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Tasks = ({items, error, loading, onFetch, onEdit, onDelete}) => {
  let taskList = <h2>No tasks found. Start adding some!</h2>;

  if (items.length > 0) {
    taskList = (
      <ul>
        {items.map((task) => (
          <TaskItem
            id={task.id}
            key={task.id}
            text={task.text}
            onEdit={onEdit}
            onDelete={onDelete.bind(null, task.id)}
          />
        ))}
      </ul>
    );
  }

  let content = taskList;

  if (error) {
    content = <button onClick={onFetch}>Try again</button>;
  }

  if (loading) {
    content = <ClipLoader color={"orangered"} loading={loading} cssOverride={override} size={150} />;
  }

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default Tasks;
