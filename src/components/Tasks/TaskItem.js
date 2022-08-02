import classes from './TaskItem.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome';
import { faEdit } from '@fortawesome/fontawesome-free-solid';
import {faRemove} from "@fortawesome/free-solid-svg-icons";

fontawesome.library.add(faEdit, faRemove);

const TaskItem = ({text, onEdit, onDelete, id}) => {
  const editTaskHandler = () => {
    console.log("TaskItem id", id);
    onEdit(id, text);
  };

  const deleteTaskHandler = () => {
    onDelete(id);
  };

  return <li className={classes.task}>
    <div className={classes.text}>{text}</div>
    <div className={classes.actions}>
      <FontAwesomeIcon icon={faEdit} onClick={editTaskHandler}/>
      <FontAwesomeIcon icon={faRemove} onClick={deleteTaskHandler}/>
    </div>
  </li>
};

export default TaskItem;