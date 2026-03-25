import React, { useState, useEffect }  from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import BasicDateTimePicker from "../components/BasicDateTimePicker";
import dayjs from 'dayjs';
import axios from "axios";


const CreateTask = ({ isOpen, toggle, createTask, fetchTasks }) => {
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
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);

    useEffect(() => {
      if (!isOpen) return;

      const fetchData = async () => {
        try {
          const catResponse = await axios.get('http://localhost:8000/api/categories/');
          const priResponse = await axios.get('http://localhost:8000/api/priorities/');
          setCategories(catResponse.data);
          setPriorities(priResponse.data);
        } catch(error){
          console.error("Failed to fetch categories or priorities:", error);
        }
      };
      fetchData();
      // axios.get('http://localhost:8000/api/categories/').then(res => {
      //     setCategories(res.data);
      // });
      // axios.get('http://localhost:8000/api/priorities/').then(res => {
      //     setPriorities(res.data);
      // });
    }, [isOpen]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData({ ...taskData, [name]: value });
    };

    const handleDateChange = (date) => {
      setTaskData({ ...taskData, start_time: date });
    };
  
    const handleDurationChange = (durationMinutes) => {
      setTaskData({ ...taskData, duration: durationMinutes });
      console.log("New Duration:", durationMinutes); // Just for checking
    };

    const handleAdd = async (e) => {
      e.preventDefault();
      if(validateForm()) {
        const success = await createTask(taskData);          
        if(success){
          toggle();
          resetFormState();
          fetchTasks();
        } else {
          alert('Please correct errors in form.');
        }
      }
    };
    
    const validateForm = () => {
      let errors = {};
      let isValid = true;

      if(!taskData.title.trim()) {
          errors['title'] = "Title cannot be empty";
          isValid = false;
      }
      if(!taskData.category) {
          errors['category'] = "Please select a category";
          isValid = false;
      }
      if(!taskData.priority) {
          errors['priority'] = "Please select a priority";
          isValid = false;
      }
      if(!taskData.start_time) {
          errors['start_time'] = "Please select a start time";
          isValid = false;
      }
      setErrors(errors);
      return isValid;
    }

    const resetFormState = () => {
      setTaskData({
        title :'',
        description: '',
        category: '',
        priority: '',
        start_time: new Date().toISOString(),
        duration: 15,
        url: '',
        address: '',  
      });
      setErrors({});
    };

    const closeModal = () => {
      toggle(); 
      resetFormState();
    };

    return (
        <Modal isOpen={isOpen} toggle={closeModal} >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <h5>New Task</h5>
            <div className="form-group" >
                        <select 
                          className = "form-control" 
                          style={{width : "auto"}} 
                          value={taskData.category.label} 
                          onChange = {handleChange} 
                          name ="category" required>
                              <option value="">Select Category</option>
                              {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.label}</option>
                              ))}
                        </select>
                        {errors.category && <div className="text-danger">{errors.category}</div>}
              </div>
              <div className="form-group" >
                        <select 
                          className = "form-control" 
                          style={{width : "auto"}} 
                          value={taskData.priority.label} 
                          onChange = {handleChange} 
                          name ="priority" 
                          required>
                              <option value="">Set priority</option>
                              {priorities.map(pri => (
                                  <option key={pri.id} value={pri.id}>{pri.label}</option>
                              ))}
                        </select>
                        {errors.priority && <div className="text-danger">{errors.priority}</div>}
              </div>
            </div>
            <ModalBody>
                    <div className = "form-group">
                        <label>Title</label>
                        <input type="text" className = "form-control" value = {taskData.title} onChange = {handleChange} name = "title" required/>
                        {errors.title && <div className="text-danger">{errors.title}</div>}
                    </div>
                    <div className = "form-group mt-2">
                        <textarea rows = "5" className = "form-control" value = {taskData.description} onChange = {handleChange} name = "description"></textarea>
                    </div>
                    <div className="form-group mt-5">
                        <label>Schedule</label>
                          <BasicDateTimePicker 
                              selectedDate={dayjs(taskData.start_time ? new Date(taskData.start_time) : new Date())} 
                              onDateTimeChange={handleDateChange}
                              onDurationChange={handleDurationChange}
                          />
                          {errors.start_time && <div className="text-danger">{errors.start_time}</div>}
                    </div>
                    <div className = "form-group mt-2">
                        <input className = "form-control" placeholder = "URL..." value = {taskData.url} onChange = {handleChange} name = "url"/>
                    </div>
                    <div className = "form-group mt-2">
                        <input className = "form-control" placeholder = "Address..." value = {taskData.address} onChange = {handleChange} name = "address"/>
                    </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleAdd}>Create</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
    );
};

export default CreateTask;
