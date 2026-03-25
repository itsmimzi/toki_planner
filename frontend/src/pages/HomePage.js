import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';
import CreateTask from '../modals/CreateTask';
import EditTask from '../modals/EditTask';
import TaskCalendar from '../components/TaskCalendar';
import Card from '../components/Card';
import Select from 'react-select';
import dayjs from 'dayjs';
import { Plus, CalendarDays, ListTodo, Filter, Archive, AlertTriangle, ChevronRight } from 'lucide-react';

const categoryOptions = [
  { value: 'meeting',  label: 'Meeting' },
  { value: 'work',     label: 'Work' },
  { value: 'coding',   label: 'Coding' },
  { value: 'workout',  label: 'Workout' },
  { value: 'personal', label: 'Personal' },
];
const priorityOptions = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
  { value: 'ASAP',   label: 'ASAP' },
];

const VIEWS = [
  { id: 'calendar',     label: 'Calendar',   icon: CalendarDays },
  { id: 'ongoing-list', label: 'Coming up',  icon: ListTodo },
  { id: 'filtered',     label: 'All tasks',  icon: Filter },
  { id: 'archived',     label: 'Archive',    icon: Archive },
];

const HomePage = () => {
  const { username, tasks, setTasks, fetchTasks, createTask, updateTask, deleteTask } = useAuth();
  const [isCreateOpen, setCreateOpen]   = useState(false);
  const [isEditOpen, setEditOpen]       = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView]                 = useState('calendar');
  const [notifiedTasks, setNotifiedTasks] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // 30-min upcoming task alerts
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        if (notifiedTasks.has(task.id)) return;
        const diff = new Date(task.start_time) - now;
        if (diff > 0 && diff <= 1800000) {
          toast.info(`Starting soon: ${task.title}`);
          setNotifiedTasks(prev => new Set(prev).add(task.id));
        }
      });
    }, 60000);
    return () => clearInterval(id);
  }, [tasks, notifiedTasks]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const next = Array.from(tasks);
    const [moved] = next.splice(source.index, 1);
    next.splice(destination.index, 0, moved);
    setTasks(next);
  };

  const filteredTasks = tasks.filter(t =>
    (categoryFilter ? t.category?.label === categoryFilter : true) &&
    (priorityFilter ? t.priority?.label === priorityFilter : true)
  );
  const sortedTasks   = filteredTasks.filter(t => !t.isComplete).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  const archivedTasks = filteredTasks.filter(t => t.isComplete).sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
  const asapTasks     = tasks.filter(t => !t.isComplete && t.priority?.label === 'ASAP')
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).slice(0, 3);

  const activeCount = tasks.filter(t => !t.isComplete).length;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={6000} />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
          <div className="p-5">
            {/* Welcome */}
            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-0.5">Welcome back</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{username || 'there'} 👋</p>
            </div>

            {/* New task button */}
            <button
              onClick={() => setCreateOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-toki-green text-white text-sm font-medium py-2.5 rounded-xl hover:bg-toki-green-dark transition-colors mb-6"
            >
              <Plus size={15} /> New task
            </button>

            {/* Navigation */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Views</p>
            <nav className="flex flex-col gap-0.5 mb-6">
              {VIEWS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors w-full text-left ${
                    view === id
                      ? 'bg-toki-green-light text-toki-teal font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                  {id === 'ongoing-list' && activeCount > 0 && (
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{activeCount}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Filters */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Filter</p>
            <div className="flex flex-col gap-2 mb-6">
              <Select
                classNamePrefix="toki-select"
                options={categoryOptions}
                onChange={o => setCategoryFilter(o ? o.value : '')}
                placeholder="Category…"
                isClearable
                value={categoryOptions.find(o => o.value === categoryFilter) || null}
              />
              <Select
                classNamePrefix="toki-select"
                options={priorityOptions}
                onChange={o => setPriorityFilter(o ? o.value : '')}
                placeholder="Priority…"
                isClearable
                value={priorityOptions.find(o => o.value === priorityFilter) || null}
              />
              {(categoryFilter || priorityFilter) && (
                <button
                  onClick={() => setView('filtered')}
                  className="flex items-center justify-between text-xs text-toki-green font-medium px-2 py-1.5 rounded-lg hover:bg-toki-green-light transition-colors"
                >
                  Apply filter <ChevronRight size={12} />
                </button>
              )}
            </div>

            {/* ASAP alerts */}
            {asapTasks.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={13} className="text-red-500" />
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Urgent</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {asapTasks.map(task => (
                    <li key={task.id} className="text-xs text-red-700">
                      <span className="font-medium block truncate">{task.title}</span>
                      <span className="text-red-400">{dayjs(task.start_time).format('MMM D · HH:mm')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* View header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-900">
              {VIEWS.find(v => v.id === view)?.label}
            </h1>
            {(view === 'ongoing-list' || view === 'filtered') && (
              <span className="text-sm text-gray-400">
                {view === 'archived' ? archivedTasks.length : sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Calendar */}
          {view === 'calendar' && (
            <div className="h-[calc(100vh-160px)]">
              <TaskCalendar tasks={tasks} />
            </div>
          )}

          {/* Coming up — draggable */}
          {view === 'ongoing-list' && (
            sortedTasks.length === 0 ? (
              <EmptyState message="No upcoming tasks. Create one to get started." />
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="ongoing-tasks">
                  {(provided) => (
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {sortedTasks.map((task, index) => (
                        <Draggable draggableId={String(task.id)} key={task.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Card taskObj={task} deleteTask={deleteTask} updateTask={updateTask} onSelect={handleEditTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )
          )}

          {/* All tasks (filtered) */}
          {view === 'filtered' && (
            filteredTasks.length === 0 ? (
              <EmptyState message="No tasks match the current filters." />
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="filtered-tasks">
                  {(provided) => (
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Card taskObj={task} deleteTask={deleteTask} updateTask={updateTask} onSelect={handleEditTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )
          )}

          {/* Archive */}
          {view === 'archived' && (
            archivedTasks.length === 0 ? (
              <EmptyState message="No completed tasks yet. Keep going!" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedTasks.map(task => (
                  <Card key={task.id} taskObj={task} deleteTask={deleteTask} updateTask={updateTask} onSelect={handleEditTask} />
                ))}
              </div>
            )
          )}
        </main>
      </div>

      <CreateTask isOpen={isCreateOpen} toggle={() => setCreateOpen(false)} createTask={createTask} fetchTasks={fetchTasks} />
      <EditTask   isOpen={isEditOpen}   toggle={() => setEditOpen(false)}   taskObj={selectedTask} />
    </>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <ListTodo size={20} className="text-gray-400" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default HomePage;
