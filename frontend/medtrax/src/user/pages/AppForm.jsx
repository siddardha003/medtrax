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
            <div className='appform-heading-container2'>
             <h2 className="appform-form-heading2"> Book an</h2>
             <h2 className="appform-form-heading"> Appointment</h2></div>
            {/* Name Field */}
            <div className='appform-container5'>
            <div className="form-col-lg-12">
                <label className="appform-input-label ">Name</label>
                <input type="text" className="appform-form-field" placeholder="David John" required />
                <div className=" height-xl-25" />
            </div>

            {/* Phone Number Field */}
            <div className="form-col-lg-12">
                <label className="appform-input-label ">Phone Number</label>
                <input type="text" className="appform-form-field" placeholder="(123) 456 - 789" required />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Email Field */}
            <div className="form-col-lg-12">
                <label className="appform-input-label ">E-Mail</label>
                <input type="email" className="appform-form-field" placeholder="example@gmail.com" required />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Preferred Date Field */}
            <div className="form-col-lg-12">
                <label className="appform-input-label ">Preferred Date</label>
                <div className="appform-date">
                    <input
                        type="date"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        isClearable
                        placeholderText="dd/mm/yyyy"
                        required
                    />
                </div>
                <div className="height-42 height-xl-25" />
            </div>

            {/* Department Dropdown */}
            <div className="form-col-lg-12">
                <label className="appform-input-label ">Department</label>
                <select
                    className="appform-form-field"
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
                    <label className="appform-input-label ">Choose a Doctor</label>
                    <select
                        className="appform-form-field"
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
                    <label className="appform-input-label ">Available Time Slots</label>
                    <select className="appform-form-field" name="time" id="time" required>
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
                <button className="appform-btn" type="submit">
                    Submit
                </button>
            </div>
            </div>
        </form>
    );
}
