import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'; 
import moment from 'moment';
import 'moment-timezone'



moment.tz.setDefault('America/New_York')
const localizer = momentLocalizer(moment);
const today = new Date();


const TaskCalendar = ({tasks}) => {
    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        // console.log("Tasks received:", tasks); 
        const mappedEvents = tasks.map(task => {
            // console.log("Processing task:", task); 
            const startTime = new Date(task.start_time);
            // console.log("Parsed start time:", startTime); 
            if (isNaN(startTime)) {
                console.error("Invalid start time for task:", task);
            }
            const duration = parseInt(task.duration); 
            if (isNaN(duration)) {
                console.error("Invalid duration for task:", task);
            }
            const endTime = new Date(startTime.getTime() + (duration * 60000));
            // console.log("Calculated end time:", endTime); 
            return {
                title: task.title,
                start: startTime,
                end: endTime,
                description: task.description,
                url: task.url,
                address: task.address,
                allDay: false
            };
        });
        setEvents(mappedEvents);
        console.log("Mapped events:", mappedEvents); 
    }, [tasks]);

    const toggle = () => {
        setModal(!modal);
    };
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        toggle();
    };
    

    return (
        <div style={{ height: 1000 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
                max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)}
                onSelectEvent={handleEventClick} 
                style={{ height: '100%'  }}
                messages={{
                    next: "Next",
                    previous: "Prev",
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day"
                }}
                />
                {selectedEvent && (
                    <Modal isOpen={modal} toggle={toggle} size="lg" className="custom-modal-calendar">
                        <ModalHeader toggle={toggle}>{selectedEvent.title}</ModalHeader>
                        <ModalBody>
                            <div className="modal-calendar-body" >{selectedEvent.description}</div>
                            <div className="modal-calendar-body"><strong>URL&nbsp;&nbsp;&nbsp;&nbsp;</strong><a href={selectedEvent.url} target="_blank" rel="noopener noreferrer">{selectedEvent.url}</a></div>
                            <div className="modal-calendar-body"><strong>Address&nbsp;&nbsp;&nbsp;&nbsp;</strong> {selectedEvent.address}</div>
                        </ModalBody>
                    </Modal>
                )}           
        </div>
    );
};

export default TaskCalendar;