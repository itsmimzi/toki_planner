import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Pencil } from 'lucide-react';
import BasicDateTimePicker from '../components/BasicDateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EditTask = ({ isOpen, toggle, taskObj }) => {
  const { updateTask } = useAuth();
  const [taskData, setTaskData]     = useState({ title: '', description: '', category: '', priority: '', start_time: new Date().toISOString(), duration: 15, url: '', address: '' });
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (taskObj && categories.length && priorities.length) {
      setTaskData({
        ...taskObj,
        start_time: taskObj.start_time ? new Date(taskObj.start_time).toISOString() : new Date().toISOString(),
        category: categories.find(c => c.id === taskObj.category)?.id || taskObj.category || '',
        priority: priorities.find(p => p.id === taskObj.priority)?.id || taskObj.priority || '',
      });
    }
  }, [taskObj, categories, priorities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(p => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    const success = await updateTask({ ...taskData, task_id: taskObj.id });
    if (success) {
      toggle();
      toast.success('Task updated!');
    }
  };

  // Clear stale data when modal closes
  const close = () => {
    toggle();
    setTaskData({ title: '', description: '', category: '', priority: '', start_time: new Date().toISOString(), duration: 15, url: '', address: '' });
  };

  if (!taskObj) return null;

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
                    <Pencil size={13} className="text-toki-green" />
                  </div>
                  <Dialog.Title className="text-base font-semibold text-gray-900">Edit task</Dialog.Title>
                </div>
                <button onClick={close} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="px-7 py-6 flex flex-col gap-5">
                {/* Title */}
                <div>
                  <label className="field-label">Title</label>
                  <input type="text" name="title" className="field" value={taskData.title} onChange={handleChange} />
                </div>

                {/* Category + Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Category</label>
                    <select name="category" className="field" value={taskData.category} onChange={handleChange}>
                      <option value="">Select…</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Priority</label>
                    <select name="priority" className="field" value={taskData.priority} onChange={handleChange}>
                      <option value="">Select…</option>
                      {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="field-label">Description</label>
                  <textarea name="description" rows={3} className="field resize-none" value={taskData.description} onChange={handleChange} />
                </div>

                {/* Schedule */}
                <div>
                  <label className="field-label">Schedule</label>
                  <BasicDateTimePicker
                    selectedDate={dayjs(taskData.start_time ? new Date(taskData.start_time) : new Date())}
                    onDateTimeChange={d => setTaskData(p => ({ ...p, start_time: dayjs(d).toISOString() }))}
                    onDurationChange={d => setTaskData(p => ({ ...p, duration: d }))}
                  />
                </div>

                {/* URL + Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">URL</label>
                    <input name="url" type="url" className="field" placeholder="https://…" value={taskData.url || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="field-label">Address</label>
                    <input name="address" className="field" placeholder="Location…" value={taskData.address || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={close} className="btn-ghost">Cancel</button>
                <button onClick={handleUpdate} className="btn-primary">Save changes</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditTask;
