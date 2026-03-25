import React, {useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../components/AuthContext'; 
import CreateTask from "../modals/CreateTask";
import EditTask from "../modals/EditTask";
import TaskCalendar from "../components/TaskCalendar";
import Card from "../components/Card";
import Select from 'react-select';
import dayjs from 'dayjs'; 



const HomePage = () => {
  const { user } = useAuth();

  const { tasks, setTasks, fetchTasks, createTask, updateTask, deleteTask} = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState('calendar');
  const [notifiedTasks, setNotifiedTasks] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    fetchTasks(); 
  },[fetchTasks]);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    toggleEditModal();
  };

  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(() => {
      const now = new Date();
      const upcomingTasks = tasks.filter(task => {
        const startTime = new Date(task.start_time);
        const timeDiff = startTime - now;
        return timeDiff > 0 && timeDiff <= 1800000;
      });  
      upcomingTasks.forEach(task => {
        if (!notifiedTasks.has(task.id)) {
          toast.info(`Upcoming task: ${task.title} starts in less than 30 min`);
          setNotifiedTasks(new Set(notifiedTasks.add(task.id)));
        }
      });
    }, 60000);
    return () => clearInterval(intervalId);
  }, [tasks, notifiedTasks, fetchTasks]);



  const toggleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen);
  };
  const toggleEditModal = () =>{
    setEditModalOpen(!isEditModalOpen)
  } ;

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
};

  const handleFilterChange = (setter) => (option) => {
    setter(option ? option.value : "");  
  };

  const categoryOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'work', label: 'Work' },
    { value: 'coding', label: 'Coding' },
    { value: 'workout', label: 'Workout' },
    { value: 'personal', label: 'Personal' }
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'ASAP', label: 'ASAP' }
  ];

  const filteredTasks = tasks.filter(task => {
    return (categoryFilter ? task.category.label === categoryFilter : true) && 
           (priorityFilter ? task.priority.label === priorityFilter : true) ;
  });

  const sortedTasks = filteredTasks.filter(task => !task.isComplete).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  const archivedTasks = filteredTasks.filter(task => task.isComplete).sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
  
  const asapTasks = tasks
  .filter(task => !(task.isComplete) && task.priority && task.priority.label === 'ASAP')
  .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
  .slice(0, 3);


  const onDragEnd = (result) => {
    const { source, destination } = result;
    if(!destination || source.index === destination.index){
      return;
    } 
    const newTasks = Array.from(tasks);
    const [reordered] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, reordered);
    console.log("New tasks order:", newTasks); // Debugging
    setTasks(newTasks);
  };

  return (
      <>
        <ToastContainer autoClose={10000}/>
          <div className="homepage-container">
              <div className="user-dashboard">
                  <div className='welcome-message'>
                    <h4 className="m-2"> Welcome back {user ? user.email : "Guest"}!</h4>
                    <div className='list-button'>
                      <Button variant="secondary" size='lg' onClick={toggleCreateModal}> Add Task</Button>
                    </div>
                  </div>
                  <div className="filter-section">
                      <Select
                        options={categoryOptions}
                        onChange={handleFilterChange(setCategoryFilter)}
                        placeholder="Category"
                        isClearable={true}
                        isSearchable={true}
                        value={categoryOptions.find(option => option.value === categoryFilter)}
                      />
                      <Select
                        className="mt-2"
                        options={priorityOptions}
                        onChange={handleFilterChange(setPriorityFilter)}
                        placeholder="Priority"
                        isClearable={true}
                        isSearchable={true}
                        value={priorityOptions.find(option => option.value === priorityFilter)}
                      />
                      <Button className="mt-2" variant="secondary"  onClick={() => setView('filtered')}>view all</Button>
                  </div>
                  <div className='list-button'>
                    <Button variant="secondary" size='lg' onClick={() => setView('calendar')}>My Calendar</Button>
                  </div>
                  <div className='list-button'>
                    <Button variant="secondary" size='lg' onClick={() => setView('ongoing-list')}>Coming Up</Button>
                  </div> 
                  <div className='list-button'>
                    <Button variant="secondary" size='lg' onClick={() => setView('archived')}>My achievements </Button>
                  </div>    
                  <div className="on-alert"> 
                    <p className="on-alert-title"> 🚨 ON ALERT 🚨 </p>
                        {asapTasks.length > 0 ? (
                          asapTasks.map(task => (
                            <div key={task.id}>
                              <p>{dayjs(task.start_time).format('MM/DD [at] HH:mm')} <br></br><li>{task.title}</li></p>
                            </div>
                          ))
                      ) : (
                          <small> nothing for now.</small>
                      )}
                  </div>  
              </div>
              <div className="main-content">
                {view === 'ongoing-list' && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="ongoing-tasks">
                      {(provided) => (
                        <div className="task-list" style={{ display: 'flex', flexWrap: 'wrap' }} {...provided.droppableProps} ref={provided.innerRef}>
                          {sortedTasks.map((task, index) => (
                            <Draggable draggableId={String(task.id)} key={task.id} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Card taskObj={task} index={index} deleteTask={deleteTask} updateTask={updateTask}  onSelect={handleEditTask}/>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  )}
                  {view === 'filtered' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="filtered-tasks">
                        {(provided) => (
                          <div className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {filteredTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Card taskObj={task} index={index} deleteTask={deleteTask} updateTask={updateTask}  onSelect={handleEditTask}/>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                  {view === "calendar" && <TaskCalendar tasks={tasks} />}
                  {view === "archived" && archivedTasks.map((task, index) => (
                      <Card key={task.id} taskObj={task} index={index} deleteTask={deleteTask} updateTask={updateTask} onSelect={handleEditTask}/>
                  ))}
              </div>
            </div>
            <CreateTask isOpen={isCreateModalOpen} toggle={toggleCreateModal} createTask={createTask} fetchTasks={fetchTasks}/>
            <EditTask isOpen={isEditModalOpen} toggle={() => setEditModalOpen(false)} updateTask={updateTask} taskObj={selectedTask} />
      
        </>
      );
};        
export default HomePage;


