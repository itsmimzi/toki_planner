import React, { useState } from "react";
import EditTask from "../modals/EditTask";
import dayjs from 'dayjs'; 
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';

const Card = ({ taskObj, index, deleteTask, updateTask, predictTask, onSelect }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskObj.id);
    }
  };

  const handleIsComplete = async () => {
    const updatedTask = {
      ...taskObj,
      isComplete: true,
      end_time: new Date().toISOString()
    };
    const success = await updateTask(updatedTask);
    if (success) {
      console.log("Task marked as complete and updated.");
      toast.info("good job !", { autoClose: 10000 });
    } else {
      alert("Failed to mark task as complete.");
    }
  }

  const handlePredict = async () => {
      const taskData = {
          task_type: taskObj.category ? taskObj.category.label : '',
          day_of_week: taskObj.day_of_week,
          has_description: taskObj.hasDescription,
          has_address: taskObj.hasAddress,
          has_url: taskObj.hasUrl,
          is_complete: taskObj.isComplete,
          start_time: taskObj.start_time,
      };

      const predictionData = await predictTask(taskData);
      if (predictionData) {
          toast.info(`Durée estimée : ~${predictionData.duration} min | Priorité suggérée : ${predictionData.priority}`, { autoClose: 8000 });
      }
  };



  const categoryLabel = taskObj.category ? taskObj.category.label : "N/A";
  const priorityLabel = taskObj.priority ? taskObj.priority.label : "N/A";
  const formattedStartTime = taskObj.start_time ? dayjs(taskObj.start_time).format('MM/DD/YYYY [at] HH:mm') : 'N/A';

  return (
      <div className="card-wrapper mr-5">
        <div className="card-top-label">
          <div className="task-category">{categoryLabel}</div>
          <div className="task-start-time">{formattedStartTime}</div>
          <div className="task-priority">{priorityLabel}</div>        
        </div>
        <div className="task-holder">
          <div className="task-header">
              <div className="task-title"> 
                  {taskObj.title}
              </div>
          </div>
          <div className="task-body">
            <div className=" task-detail ">{taskObj.description ? taskObj.description : <input className=" task-detail-none "   placeholder="edit task to ask description" disabled/>}</div>
            <div className=" task-detail ">{taskObj.url ? <a href={taskObj.url}>{taskObj.url}</a> : <input className=" task-detail-none "  placeholder=" edit task to add a url" disabled />}</div>
            <div className=" task-detail ">{taskObj.address ? taskObj.address : <input className=" task-detail-none "  placeholder="edit task to add address" disabled/>}</div>
          </div>
          <div className="task-footer">
            <Button variant="dark" size="sm" onClick={() => onSelect(taskObj)}>update</Button>{''}
            {!taskObj.isComplete && (
              <Button variant="success" size="sm" onClick={handleIsComplete}>complete</Button>
            )}
            {!taskObj.isComplete && (
              <Button variant="secondary" size="sm" onClick={handlePredict}>plan</Button>
            )}
            <Button variant="danger" size="sm" onClick={handleDelete}>delete</Button>{''}
          </div>
        </div>
        {modal && (
          < EditTask
              isOpen={modal}
              toggle={toggle}
              taskObj={taskObj}
          />
        )}
      </div>
    );
};
export default Card;
