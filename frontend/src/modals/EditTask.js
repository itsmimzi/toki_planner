import React, {useEffect, useState} from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import BasicDateTimePicker from "../components/BasicDateTimePicker";
import dayjs from 'dayjs';
import { useAuth } from '../components/AuthContext';
import axios from "axios";
import { toast } from 'react-toastify';


const EditTask = ({isOpen, toggle, taskObj}) => {

  const {updateTask} = useAuth();
  const [taskData, setTaskData] = useState({
    title : '',
    description: '',
    category: '',
    priority: '',
    start_time: new Date().toISOString(),
    duration: 15,
    url: '',
    address: '',  
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    if (taskObj) {
        setTaskData({ 
          ...taskObj,
        });
    }
  },[taskObj]);

  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const catRes = await axios.get('http://localhost:8000/api/categories/');
            const priRes = await axios.get('http://localhost:8000/api/priorities/');
            setCategories(catRes.data);
            setPriorities(priRes.data);
        } catch (error) {
            console.error("Failed to fetch categories or priorities", error);
        }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (taskObj) {
        setTaskData({
            ...taskObj,
            start_time: taskObj.start_time ? new Date(taskObj.start_time).toISOString() : new Date().toISOString(),
            category: categories.find(c => c.id === taskObj.category)?.id || '',
            priority: priorities.find(p => p.id === taskObj.priority)?.id || '',
        });
    }
  }, [taskObj, categories, priorities]);

  const handleChange = (e) => {
    const {name, value} = e.target
    setTaskData(prev => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date) => {
    const isoDate = dayjs(date).toISOString();
    setTaskData({ ...taskData, start_time: isoDate });
  };
  const handleDurationChange = (durationMinutes) => {
    setTaskData({ ...taskData, duration: durationMinutes });
  };

  const handleUpdate = async () => {
    const success= await updateTask({
      ...taskData,
      task_id: taskObj.id,
    });
    if (success) {
      toggle();
      toast.info("updated !")
    } else {
      alert("Failed to update the task.");
    }
  };

  const closeModal = () => {
    toggle(); 
    resetFormState();
  };

  const resetFormState = () => {
    setTaskData({
      title : '',
      description: '',
      category: '',
      priority: '',
      start_time: new Date().toISOString(),
      duration: 15,
      url: '',
      address: '',  
    });
    // setErrors({});
  };

  return (
      <Modal isOpen={isOpen} toggle={closeModal}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <h5>Update Task</h5>
          <div className="form-group" >
                      <select className = "form-control" style={{width : "auto"}} value={taskData.category} onChange = {handleChange} name ="category">
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
            </div>
            <div className="form-group" >
                      <select className = "form-control" style={{width : "auto"}} value={taskData.priority} onChange = {handleChange} name ="priority">
                        <option value="">Select Priority</option>
                        {priorities.map(pri => (
                            <option key={pri.id} value={pri.id}>{pri.label}</option>
                        ))}
                      </select>
            </div>
          </div>
          <ModalBody>
                  <div className = "form-group">
                      <label>Title</label>
                      <input type="text" className = "form-control" value = {taskData.title} onChange = {handleChange} name = "title"/>
                  </div>
                  <div className = "form-group">
                      <label>Description</label>
                      <textarea rows = "5" className = "form-control" value = {taskData.description} onChange = {handleChange} name = "description"></textarea>
                  </div>
                  <div className="form-group mt-5">
                        <label>Schedule</label>
                          <BasicDateTimePicker 
                              selectedDate={dayjs(taskData.start_time ? new Date(taskData.start_time) : new Date())} 
                              onDateTimeChange={handleDateChange}
                              onDurationChange={handleDurationChange} />
                  </div>
                  <div className = "form-group mt-2">
                      <input className = "form-control" placeholder = "URL..." value = {taskData.url} onChange = {handleChange} name = "url"/>
                  </div>
                  <div className = "form-group mt-2">
                      <input className = "form-control" placeholder = "Address..." value = {taskData.address} onChange = {handleChange} name = "address"/>
                  </div>
          </ModalBody>
          <ModalFooter>
          <Button color="primary" onClick={() => handleUpdate(taskData)}>Update</Button>{''}
          <Button color="secondary" onClick={toggle}>Cancel</Button>{''}
          </ModalFooter>
    </Modal>
  );
};
export default EditTask;

