import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/AppForm.css';

export default function AppForm() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [department, setDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);

    // Fetch available doctors when department and date are selected
    useEffect(() => {
        if (department && selectedDate) {
            fetchDoctors();
        }
    }, [department, selectedDate]);

    const fetchDoctors = async () => {
        // Mocking backend call to get doctors
        const availableDoctors = [
            { id: 'doctor1', name: 'Dr. Sarayu' },
            { id: 'doctor2', name: 'Dr. Siddhu' },
            { id: 'doctor3', name: 'Dr. Rishitha' },
        ];
        setDoctors(availableDoctors);
    };

    // Fetch available time slots when a doctor is selected
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchTimeSlots();
        }
    }, [selectedDoctor]);

    const fetchTimeSlots = async () => {
        // Mocking backend call to get time slots
        const availableTimeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
        setTimeSlots(availableTimeSlots);
    };

    return (
        <form action="#" className="form-row">
            <div className='heading-container2'>
             <h2 className="form-heading2"> Book an</h2>
             <h2 className="form-heading"> Appointment</h2></div>
            {/* Name Field */}
            <div className='new-container5'>
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Name</label>
                <input type="text" className="form-field" placeholder="David John" required />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Phone Number Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Phone Number</label>
                <input type="text" className="form-field" placeholder="(123) 456 - 789" required />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Email Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">E-Mail</label>
                <input type="email" className="form-field" placeholder="example@gmail.com" required />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Preferred Date Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Preferred Date</label>
                <div className="with-icon-input">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        isClearable
                        placeholderText="dd/mm/yyyy"
                        required
                    />
                    <i>
                        <Icon icon="fa6-solid:calendar-days" />
                    </i>
                </div>
                <div className="height-42 height-xl-25" />
            </div>

            {/* Department Dropdown */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Department</label>
                <select
                    className="form-field"
                    name="department"
                    id="department"
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                >
                    <option value="" disabled selected>Select Department</option>
                    <option value="pediatric">Pediatric</option>
                    <option value="obstetricsGynecology">Obstetrics and Gynecology</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                </select>
            </div>

            {/* Conditionally Render Doctor Dropdown */}
            {department && (
                <div className="form-col-lg-12">
                    <label className="input-label heading-color">Choose a Doctor</label>
                    <select
                        className="form-field"
                        name="doctor"
                        id="doctor"
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                    >
                        <option value="" disabled selected>Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Conditionally Render Time Slots Dropdown */}
            {selectedDoctor && (
                <div className="form-col-lg-12">
                    <label className="input-label heading-color">Available Time Slots</label>
                    <select className="form-field" name="time" id="time" required>
                        <option value="" disabled selected>Select Time Slot</option>
                        {timeSlots.map((timeSlot, index) => (
                            <option key={index} value={timeSlot}>
                                {timeSlot}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Submit Button */}
            <div className="form-col-lg-12">
                <button className="btn1-style-1" type="submit">
                    <span>Submit</span>
                   
                </button>
            </div>
            </div>
        </form>
    );
}
