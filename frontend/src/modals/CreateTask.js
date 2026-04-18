import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Lock } from 'lucide-react';
import BasicDateTimePicker from '../components/BasicDateTimePicker';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CreateTask = ({ isOpen, toggle, createTask }) => {
  const [taskData, setTaskData] = useState({
    title: '', description: '', category: '', priority: '',
    start_time: new Date().toISOString(), duration: 15, url: '', address: '', due_date: '',
    is_focus_block: false,
  });
  const [errors, setErrors]         = useState({});
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchOptions = async () => {
      try {
        const [catRes, priRes] = await Promise.all([
          axios.get(`${API_BASE}/api/categories/`),
          axios.get(`${API_BASE}/api/priorities/`),
        ]);
        setCategories(catRes.data);
        setPriorities(priRes.data);
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };
    fetchOptions();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(p => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!taskData.is_focus_block) {
      if (!taskData.title.trim()) e.title    = 'Title is required';
      if (!taskData.category)     e.category = 'Please select a category';
      if (!taskData.priority)     e.priority = 'Please select a priority';
    }
    if (!taskData.start_time) e.start_time = 'Please select a start time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await createTask(taskData);
    if (success) {
      toggle();
      resetForm();
      // fetchTasks is not needed — createTask already adds the task
      // optimistically to state in AuthContext via setTasks
    }
  };

  const resetForm = () => {
    setTaskData({ title: '', description: '', category: '', priority: '',
      start_time: new Date().toISOString(), duration: 15, url: '', address: '', due_date: '',
      is_focus_block: false });
    setErrors({});
  };

  // Reset whenever the modal closes
  useEffect(() => { if (!isOpen) resetForm(); }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => { toggle(); resetForm(); };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={close} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95 translate-y-2" enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-modal relative my-8">
              {/* Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-toki-green-light rounded-lg flex items-center justify-center">
                    <Plus size={14} className="text-toki-green" />
                  </div>
                  <Dialog.Title className="text-base font-semibold text-gray-900">New task</Dialog.Title>
                </div>
                <button onClick={close} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAdd}>
                <div className="px-7 py-6 flex flex-col gap-5">

                  {/* Title */}
                  <div className={taskData.is_focus_block ? 'opacity-50' : ''}>
                    <label className="field-label">
                      Title{' '}
                      {taskData.is_focus_block
                        ? <span className="text-gray-300 normal-case font-normal">(optional — defaults to "Focus Block")</span>
                        : <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="title"
                      className={`field ${errors.title ? 'border-red-300' : ''}`}
                      placeholder={taskData.is_focus_block ? 'Focus Block' : 'What needs to get done?'}
                      value={taskData.title}
                      onChange={handleChange}
                      required={!taskData.is_focus_block}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  {/* Category + Priority row */}
                  <div className={`grid grid-cols-2 gap-4 ${taskData.is_focus_block ? 'opacity-50' : ''}`}>
                    <div>
                      <label className="field-label">
                        Category{' '}
                        {taskData.is_focus_block
                          ? <span className="text-gray-300 normal-case font-normal">(optional)</span>
                          : <span className="text-red-400">*</span>}
                      </label>
                      <select name="category" className={`field ${errors.category ? 'border-red-300' : ''}`} value={taskData.category} onChange={handleChange} required={!taskData.is_focus_block}>
                        <option value="">Select…</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                    </div>
                    <div>
                      <label className="field-label">
                        Priority{' '}
                        {taskData.is_focus_block
                          ? <span className="text-gray-300 normal-case font-normal">(optional)</span>
                          : <span className="text-red-400">*</span>}
                      </label>
                      <select name="priority" className={`field ${errors.priority ? 'border-red-300' : ''}`} value={taskData.priority} onChange={handleChange} required={!taskData.is_focus_block}>
                        <option value="">Select…</option>
                        {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                      {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="field-label">Description <span className="text-gray-300">(optional)</span></label>
                    <textarea
                      name="description"
                      rows={3}
                      className="field resize-none"
                      placeholder="Add notes…"
                      value={taskData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="field-label">Schedule <span className="text-red-400">*</span></label>
                    <BasicDateTimePicker
                      selectedDate={dayjs(taskData.start_time ? new Date(taskData.start_time) : new Date())}
                      onDateTimeChange={d => setTaskData(p => ({ ...p, start_time: d }))}
                      onDurationChange={d => setTaskData(p => ({ ...p, duration: d }))}
                    />
                    {errors.start_time && <p className="text-xs text-red-500 mt-1">{errors.start_time}</p>}
                  </div>

                  {/* Due date */}
                  <div>
                    <label className="field-label">Due date <span className="text-gray-300">(optional)</span></label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={taskData.due_date ? dayjs(taskData.due_date) : null}
                        onChange={v => setTaskData(p => ({ ...p, due_date: v ? v.toISOString() : '' }))}
                        slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: 'No deadline' } }}
                      />
                    </LocalizationProvider>
                  </div>

                  {/* URL + Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">URL <span className="text-gray-300">(optional)</span></label>
                      <input name="url" type="url" className="field" placeholder="https://…" value={taskData.url} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="field-label">Address <span className="text-gray-300">(optional)</span></label>
                      <input name="address" className="field" placeholder="Location…" value={taskData.address} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Focus block toggle */}
                <div
                  onClick={() => setTaskData(p => ({ ...p, is_focus_block: !p.is_focus_block }))}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-colors ${
                    taskData.is_focus_block
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-gray-50 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    taskData.is_focus_block ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Lock size={14} className={taskData.is_focus_block ? 'text-indigo-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${taskData.is_focus_block ? 'text-indigo-700' : 'text-gray-700'}`}>Focus block</p>
                    <p className="text-xs text-gray-400">Protected time — no interruptions</p>
                  </div>
                  <div className={`ml-auto w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                    taskData.is_focus_block ? 'bg-indigo-500' : 'bg-gray-200'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${
                      taskData.is_focus_block ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={close} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-primary">Create task</button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateTask;
