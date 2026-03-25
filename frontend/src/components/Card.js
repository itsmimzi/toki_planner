import React from 'react';
import { Pencil, CheckCircle, Sparkles, Trash2, ExternalLink, MapPin, FileText } from 'lucide-react';
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

  const priorityKey   = taskObj.priority?.label || 'low';
  const priorityStyle = PRIORITY_STYLES[priorityKey] || PRIORITY_STYLES.low;
  const categoryLabel = taskObj.category?.label || '—';
  const formattedTime = taskObj.start_time
    ? dayjs(taskObj.start_time).format('MMM D [·] HH:mm')
    : '—';

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

  const handlePredict = async () => {
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
    if (result) {
      toast.info(`~${result.duration} min · ${result.priority} priority`, { autoClose: 8000 });
    }
  };

  return (
    <div className={`task-card relative overflow-hidden group ${taskObj.isComplete ? 'opacity-60' : ''}`}>
      {/* Priority indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityStyle.bar}`} />

      <div className="pl-5 pr-5 pt-4 pb-4">
        {/* Top meta row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="badge badge-green text-xs">{categoryLabel}</span>
          <span className="badge badge-gray text-xs">{formattedTime}</span>
          <span className={`badge ${priorityStyle.badge} text-xs ml-auto`}>{priorityStyle.label}</span>
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold text-gray-900 mb-2 leading-snug ${taskObj.isComplete ? 'line-through text-gray-400' : ''}`}>
          {taskObj.title}
        </h3>

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
              onClick={handlePredict}
              title="AI prediction"
              className="p-1.5 text-gray-400 hover:text-toki-teal hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Sparkles size={13} />
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
  );
};

export default Card;
