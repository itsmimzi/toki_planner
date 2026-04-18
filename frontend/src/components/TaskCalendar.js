import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState, Fragment } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Dialog, Transition } from '@headlessui/react';
import { X, Link, MapPin } from 'lucide-react';
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('America/New_York');
const localizer = momentLocalizer(moment);
const today = new Date();

// Category palette — light bg, colored left border, text always near-black
const CATEGORY_COLORS = {
  meeting:  { bg: '#dbeafe', border: '#3b82f6' },
  work:     { bg: '#e0e7ff', border: '#6366f1' },
  coding:   { bg: '#ede9fe', border: '#8b5cf6' },
  workout:  { bg: '#ffedd5', border: '#f97316' },
  personal: { bg: '#fce7f3', border: '#ec4899' },
  default:  { bg: '#e8f8f2', border: '#28b67e' },
};

// Focus block: neutral gray — signals protected / unavailable time
const FOCUS_BLOCK_COLORS = { bg: '#f1f5f9', border: '#94a3b8' };

const getCategoryColors = (category) => {
  const key = (category || '').toLowerCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
};

const TaskCalendar = ({ tasks }) => {
  const [events, setEvents]               = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const mappedEvents = tasks.map(task => {
      const startTime = new Date(task.start_time);
      const duration  = parseInt(task.duration) || 30;
      const endTime   = new Date(startTime.getTime() + duration * 60000);
      const categoryLabel = task.category?.label || task.category || '';
      return {
        title:          task.is_focus_block ? `🔒 ${task.title}` : task.title,
        start:          startTime,
        end:            endTime,
        description:    task.description,
        url:            task.url,
        address:        task.address,
        category:       categoryLabel,
        isComplete:     task.isComplete,
        is_focus_block: task.is_focus_block,
        allDay:         false,
      };
    });
    setEvents(mappedEvents);
  }, [tasks]);

  const eventPropGetter = (event) => {
    const colors = event.is_focus_block ? FOCUS_BLOCK_COLORS : getCategoryColors(event.category);
    const done   = event.isComplete;
    return {
      style: {
        backgroundColor: done ? '#f3f4f6' : colors.bg,
        borderLeft:      `3px solid ${done ? '#d1d5db' : colors.border}`,
        color:           done ? '#9ca3af' : '#111827',
        borderRadius:    '6px',
        fontSize:        '12px',
        fontWeight:      '500',
        padding:         '2px 6px',
        border:          'none',
        boxShadow:       'none',
        textDecoration:  done ? 'line-through' : 'none',
        opacity:         event.is_focus_block ? 0.75 : 1,
      },
    };
  };

  return (
    <div style={{ height: '100%' }}>
      {/* Category legend */}
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').map(([key, colors]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
            style={{ backgroundColor: colors.bg, color: '#111827', borderLeft: `3px solid ${colors.border}` }}
          >
            {key}
          </span>
        ))}
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: FOCUS_BLOCK_COLORS.bg, color: '#475569', borderLeft: `3px solid ${FOCUS_BLOCK_COLORS.border}` }}
        >
          🔒 Focus block
        </span>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        onSelectEvent={setSelectedEvent}
        min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
        max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)}
        style={{ height: 'calc(100% - 48px)' }}
        messages={{ next: 'Next', previous: 'Prev', today: 'Today', month: 'Month', week: 'Week', day: 'Day' }}
      />

      {/* Event detail dialog */}
      <Transition show={!!selectedEvent} as={Fragment}>
        <Dialog onClose={() => setSelectedEvent(null)} className="relative z-50">
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
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95 translate-y-2" enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-modal p-6 relative">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>

                {selectedEvent && (() => {
                  const colors = getCategoryColors(selectedEvent.category);
                  return (
                    <>
                      {/* Category pill */}
                      {selectedEvent.category && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mb-3"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {selectedEvent.category}
                        </span>
                      )}

                      <Dialog.Title className="text-base font-semibold text-gray-900 mb-1 pr-8">
                        {selectedEvent.title}
                      </Dialog.Title>
                      <p className="text-xs text-gray-400 mb-4">
                        {moment(selectedEvent.start).format('ddd D MMM · HH:mm')} –{' '}
                        {moment(selectedEvent.end).format('HH:mm')}
                      </p>

                      {selectedEvent.description && (
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedEvent.description}</p>
                      )}

                      <div className="flex flex-col gap-2">
                        {selectedEvent.url && (
                          <a
                            href={selectedEvent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-toki-teal hover:underline truncate"
                          >
                            <Link size={12} /> {selectedEvent.url}
                          </a>
                        )}
                        {selectedEvent.address && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={12} /> {selectedEvent.address}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TaskCalendar;
