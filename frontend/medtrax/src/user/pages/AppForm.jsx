import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getPublicHospitalDetailsApi, createAppointmentApi } from '../../Api';
import { useSelector } from 'react-redux';
import '../css/AppForm.css';

export default function AppForm() {
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const location = useLocation();
    const hospitalId = id || searchParams.get('hospitalId');
    const passedHospital = location.state?.hospital;
    
    const user = useSelector(state => state.user.user);
    const [hospital, setHospital] = useState(passedHospital || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [department, setDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);    // Fetch hospital details
    useEffect(() => {
        const fetchHospital = async () => {
            if (hospitalId && !hospital) {
                try {
                    const response = await getPublicHospitalDetailsApi(hospitalId);
                    setHospital(response.data);
                } catch (err) {
                    console.error('Error fetching hospital:', err);
                    setError('Failed to load hospital details');
                }
            }
        };
        
        fetchHospital();
    }, [hospitalId, hospital]);// Fetch available doctors when department and date are selected
    useEffect(() => {
        if (department && selectedDate && hospital) {
            fetchDoctors();
        }
    }, [department, selectedDate, hospital]);

    const fetchDoctors = async () => {
        try {
            // Find doctors from hospital services based on selected department
            const serviceData = hospital.services?.find(service => 
                service.category.toLowerCase() === department.toLowerCase()
            );
            
            if (serviceData && serviceData.doctors) {
                setDoctors(serviceData.doctors);
            } else {
                // Fallback to mock data if no specific doctors found
                const availableDoctors = [
                    { id: 'doctor1', name: 'Dr. Sarayu' },
                    { id: 'doctor2', name: 'Dr. Siddhu' },
                    { id: 'doctor3', name: 'Dr. Rishitha' },
                ];
                setDoctors(availableDoctors);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setDoctors([]);
        }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError('Please login to book an appointment');
            return;
        }

        if (!hospitalId || !selectedDate || !department || !selectedDoctor || !formData.time) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const appointmentData = {
                hospitalId,
                doctorId: selectedDoctor,
                department,
                appointmentDate: selectedDate.toISOString(),
                appointmentTime: formData.time,
                patientName: formData.name,
                patientPhone: formData.phone,
                patientEmail: formData.email,
                notes: formData.notes,
                status: 'pending'
            };

            await createAppointmentApi(appointmentData);
            alert('Appointment booked successfully!');
            
            // Reset form
            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                time: '',
                notes: ''
            });
            setSelectedDate(null);
            setDepartment('');
            setSelectedDoctor('');
            setTimeSlots([]);
            
        } catch (err) {
            console.error('Error booking appointment:', err);
            setError('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action="#" className="form-row" onSubmit={handleSubmit}>
            <div className='heading-container2'>
             <h2 className="form-heading2"> Book an</h2>
             <h2 className="form-heading"> Appointment</h2></div>
            {/* Name Field */}
            <div className='new-container5'>
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Name</label>
                <input
                    type="text"
                    className="form-field"
                    placeholder="David John"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Phone Number Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Phone Number</label>
                <input
                    type="text"
                    className="form-field"
                    placeholder="(123) 456 - 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Email Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">E-Mail</label>
                <input
                    type="email"
                    className="form-field"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Hospital Field - Disabled when pre-selected */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Hospital</label>
                <input
                    type="text"
                    className="form-field"
                    value={hospital ? hospital.name : 'Loading...'}
                    disabled={true}
                    style={{ 
                        backgroundColor: '#f5f5f5', 
                        color: '#666',
                        cursor: 'not-allowed' 
                    }}
                />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Hospital Field - Disabled when pre-selected */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Hospital</label>
                <input
                    type="text"
                    className="form-field"
                    value={hospital ? hospital.name : 'Loading...'}
                    disabled={true}
                    style={{ 
                        backgroundColor: '#f5f5f5', 
                        color: '#666',
                        cursor: 'not-allowed' 
                    }}
                />
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
            </div>            {/* Display Hospital Name */}
            {hospital && (
                <div className="form-col-lg-12">
                    <h3>Booking appointment at: {hospital.name}</h3>
                    <div className="height-42 height-xl-25" />
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="form-col-lg-12">
                    <div style={{color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px'}}>
                        {error}
                    </div>
                    <div className="height-42 height-xl-25" />
                </div>
            )}

            {/* Department Dropdown */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Department</label>
                <select
                    className="form-field"
                    name="department"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Department</option>
                    {hospital?.services?.map((service, index) => (
                        <option key={index} value={service.category}>{service.category}</option>
                    )) || (
                        <>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                        </>
                    )}
                </select>
                <div className="height-42 height-xl-25" />
            </div>            {/* Conditionally Render Doctor Dropdown */}
            {department && (
                <div className="form-col-lg-12">
                    <label className="input-label heading-color">Choose a Doctor</label>
                    <select
                        className="form-field"
                        name="doctor"
                        id="doctor"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} {doctor.degree && `- ${doctor.degree}`}
                            </option>
                        ))}
                    </select>
                    <div className="height-42 height-xl-25" />
                </div>
            )}

            {/* Conditionally Render Time Slots Dropdown */}
            {selectedDoctor && (
                <div className="form-col-lg-12">
                    <label className="input-label heading-color">Available Time Slots</label>
                    <select
                        className="form-field"
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                    >
                        <option value="" disabled>Select Time Slot</option>
                        {timeSlots.map((timeSlot, index) => (
                            <option key={index} value={timeSlot}>
                                {timeSlot}
                            </option>
                        ))}
                    </select>
                    <div className="height-42 height-xl-25" />
                </div>
            )}

            {/* Notes Field */}
            <div className="form-col-lg-12">
                <label className="input-label heading-color">Additional Notes</label>
                <textarea
                    className="form-field"
                    placeholder="Any additional information or notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="height-42 height-xl-25" />
            </div>

            {/* Submit Button */}
            <div className="form-col-lg-12">
                <button className="btn1-style-1" type="submit" disabled={loading}>
                    <span>{loading ? 'Booking...' : 'Submit'}</span>
                </button>
            </div>
            {error && (
                <div className="form-col-lg-12">
                    <p className="error-message">{error}</p>
                </div>
            )}
            </div>
        </form>
    );
}
