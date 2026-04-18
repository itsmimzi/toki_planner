import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Pencil, CheckCircle, Sparkles, Trash2, ExternalLink, MapPin, FileText, CalendarClock, X, Zap, Lock } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const PRIORITY_STYLES = {
  ASAP:   { bar: 'bg-red-500',   badge: 'badge-red',   label: 'ASAP' },
  high:   { bar: 'bg-amber-400', badge: 'badge-amber',  label: 'High' },
  medium: { bar: 'bg-blue-400',  badge: 'badge-blue',   label: 'Medium' },
  low:    { bar: 'bg-gray-300',  badge: 'badge-gray',   label: 'Low' },
};

const Card = ({ taskObj, deleteTask, updateTask, onSelect }) => {
  const { predictTask } = useAuth();
  const [prediction, setPrediction] = useState(null);

  const priorityKey   = taskObj.priority?.label || 'low';
  const priorityStyle = PRIORITY_STYLES[priorityKey] || PRIORITY_STYLES.low;
  const categoryLabel = taskObj.category?.label || '—';
  const formattedTime = taskObj.start_time
    ? dayjs(taskObj.start_time).format('MMM D [·] HH:mm')
    : '—';

  const dueBadge = (() => {
    if (!taskObj.due_date || taskObj.isComplete) return null;
    const now  = dayjs();
    const due  = dayjs(taskObj.due_date);
    const diff = due.diff(now, 'hour');
    if (diff < 0)  return { label: 'Overdue',   cls: 'bg-red-100 text-red-600' };
    if (diff < 24) return { label: 'Due today',  cls: 'bg-red-100 text-red-600' };
    if (diff < 48) return { label: 'Due tomorrow', cls: 'bg-amber-100 text-amber-700' };
    return { label: `Due ${due.format('MMM D')}`, cls: 'bg-gray-100 text-gray-500' };
  })();

  const handleComplete = async () => {
    const success = await updateTask({
      ...taskObj,
      isComplete: true,
      end_time: new Date().toISOString(),
    });
    if (success) toast.success('Well done! Task completed.');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Delete this task?')) deleteTask(taskObj.id);
  };

  const handleAutoSchedule = async () => {
    const taskData = {
      task_type:       taskObj.category?.label || '',
      day_of_week:     taskObj.day_of_week,
      has_description: !!taskObj.description,
      has_address:     !!taskObj.address,
      has_url:         !!taskObj.url,
      is_complete:     taskObj.isComplete,
      start_time:      taskObj.start_time,
    };
    const result = await predictTask(taskData);
    if (result) setPrediction(result);
  };

  const applyPrediction = async () => {
    const success = await updateTask({
      ...taskObj,
      duration: parseInt(prediction.duration),
    });
    if (success) {
      toast.success(`Rescheduled — ${prediction.duration} min · ${prediction.priority} priority`);
    }
    setPrediction(null);
  };

  const isFocus = taskObj.is_focus_block;

  return (
    <>
      <div className={`task-card relative overflow-hidden group ${taskObj.isComplete ? 'opacity-60' : ''} ${isFocus ? 'ring-2 ring-indigo-300' : ''}`}>
        {/* Priority / focus indicator bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isFocus ? 'bg-indigo-400' : priorityStyle.bar}`} />

        {/* Focus block banner */}
        {isFocus && (
          <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
            <Lock size={11} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Focus block</span>
          </div>
        )}

        <div className="pl-5 pr-5 pt-4 pb-4">
          {/* Top meta row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`badge text-xs ${isFocus ? 'bg-indigo-100 text-indigo-700' : 'badge-green'}`}>{categoryLabel}</span>
            <span className="badge badge-gray text-xs">{formattedTime}</span>
            {dueBadge && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${dueBadge.cls}`}>
                <CalendarClock size={10} />
                {dueBadge.label}
              </span>
            )}
            <span className={`badge ${priorityStyle.badge} text-xs ml-auto`}>{priorityStyle.label}</span>
          </div>

          {/* Title */}
          <h3 className={`text-sm font-semibold text-gray-900 mb-2 leading-snug ${taskObj.isComplete ? 'line-through text-gray-400' : ''}`}>
            {taskObj.title}
          </h3>

          {/* Urgency bar */}
          {taskObj.urgency_score != null && !taskObj.isComplete && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Urgency</span>
                <span className={`text-xs font-medium ${
                  taskObj.urgency_score >= 75 ? 'text-red-500' :
                  taskObj.urgency_score >= 40 ? 'text-amber-500' : 'text-gray-400'
                }`}>
                  {taskObj.urgency_score >= 75 ? 'Critical' :
                   taskObj.urgency_score >= 40 ? 'High' : 'Normal'}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    taskObj.urgency_score >= 75 ? 'bg-red-500' :
                    taskObj.urgency_score >= 40 ? 'bg-amber-400' : 'bg-toki-green'
                  }`}
                  style={{ width: `${taskObj.urgency_score}%` }}
                />
              </div>
            </div>
          )}

          {/* Optional details */}
          <div className="flex flex-col gap-1.5">
            {taskObj.description && (
              <p className="text-xs text-gray-500 flex items-start gap-1.5 line-clamp-2">
                <FileText size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
                {taskObj.description}
              </p>
            )}
            {taskObj.url && (
              <a href={taskObj.url} target="_blank" rel="noreferrer" className="text-xs text-toki-green flex items-center gap-1.5 hover:underline">
                <ExternalLink size={12} className="flex-shrink-0" />
                {taskObj.url.replace(/^https?:\/\//, '').slice(0, 40)}
              </a>
            )}
            {taskObj.address && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                {taskObj.address}
              </p>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => onSelect(taskObj)}
              title="Edit"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Pencil size={13} />
            </button>
            {!taskObj.isComplete && (
              <button
                onClick={handleComplete}
                title="Mark complete"
                className="p-1.5 text-gray-400 hover:text-toki-green hover:bg-toki-green-light rounded-lg transition-colors"
              >
                <CheckCircle size={13} />
              </button>
            )}
            {!taskObj.isComplete && (
              <button
                onClick={handleAutoSchedule}
                className="ml-1 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-toki-green-light text-toki-teal hover:bg-toki-green hover:text-white transition-colors"
              >
                <Sparkles size={12} />
                Auto-schedule
              </button>
            )}
            <button
              onClick={handleDelete}
              title="Delete"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-schedule suggestion modal */}
      <Transition show={!!prediction} as={Fragment}>
        <Dialog onClose={() => setPrediction(null)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-modal p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-toki-green-light rounded-lg flex items-center justify-center">
                      <Zap size={14} className="text-toki-green" />
                    </div>
                    <Dialog.Title className="text-sm font-semibold text-gray-900">Auto-schedule suggestion</Dialog.Title>
                  </div>
                  <button onClick={() => setPrediction(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={15} />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Based on this task's profile, Toki suggests:
                </p>

                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-around mb-5">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-lg font-bold text-gray-900">{prediction?.duration} <span className="text-xs font-normal text-gray-400">min</span></p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Priority</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{prediction?.priority}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-5">
                  Would you like to reschedule this task accordingly?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPrediction(null)}
                    className="flex-1 btn-ghost text-sm"
                  >
                    No, keep as is
                  </button>
                  <button
                    onClick={applyPrediction}
                    className="flex-1 btn-primary text-sm justify-center"
                  >
                    Yes, apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Card;
