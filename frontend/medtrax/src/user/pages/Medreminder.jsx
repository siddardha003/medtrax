import React, { useState, useEffect } from "react";
import { useAuth } from '../../hooks/useAuth';
import {
  saveMedicineReminderApi,
  getMedicineRemindersApi,
  deleteMedicineReminderApi,
  updateMedicineReminderApi
} from '../../Api';
import { scheduleReminder } from '../../notifications';
import "../css/Medreminder.css";

// Helper: Request browser notification permission
const requestNotificationPermission = () => {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
};

// Helper: Show a browser notification
const showBrowserNotification = (title, options) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  }
};

const MedReminder = () => {
  const { isAuthenticated, user } = useAuth();
  const [reminders, setReminders] = useState([]); // Store all reminders
  const [activeReminders, setActiveReminders] = useState([]);
  const [completedReminders, setCompletedReminders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    startDate: "",
    endDate: "",
    times: [""], // Initialize with one time slot
    days: [],
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [pushSubscription, setPushSubscription] = useState(null);
  const [editingReminderId, setEditingReminderId] = useState(null); // Track if editing

  // Fetch reminders from the database on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchReminders();
    }
    requestNotificationPermission();
  }, [isAuthenticated]);

  // Setup push subscription only when the user is authenticated
  useEffect(() => {
    async function setupPush() {
      if (isAuthenticated && 'serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;

          // Step 1: Get the subscription from the browser
          let sub = await reg.pushManager.getSubscription();

          // Step 2: If no subscription, create one
          if (!sub) {
            const { getVapidPublicKey, subscribeUserToPush } = await import('../../notifications');
            const publicKey = await getVapidPublicKey();
            sub = await subscribeUserToPush(reg, publicKey);
          }

          // Step 3: ALWAYS send the subscription to the backend to ensure it's synced with the userId
          if (sub) {
            const { sendSubscriptionToBackend } = await import('../../notifications');
            await sendSubscriptionToBackend(sub);
          }

          setPushSubscription(sub);
        } catch (err) {
        }
      } else if (!isAuthenticated) {
      }
    }

    setupPush();
  }, [isAuthenticated]); // Rerun this effect when authentication state changes

  const fetchReminders = async () => {
    try {
      const response = await getMedicineRemindersApi({ active: true });
      if (response.data.success) {
        const allReminders = response.data.data.map(rem => ({
          ...rem,
          id: rem._id || rem.id
        }));
        setReminders(allReminders);
        // Filter into active and completed lists
        setActiveReminders(allReminders.filter(r => r.status === 'active'));
        setCompletedReminders(allReminders.filter(r => r.status === 'completed'));
        if (Array.isArray(allReminders)) {
          allReminders.forEach((rem, idx) => {
          });
        }
      }
    } catch (error) {
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDaySelection = (day) => {
    setFormData((prev) => {
      const isSelected = prev.days.includes(day);
      return {
        ...prev,
        days: isSelected
          ? prev.days.filter((d) => d !== day) // Deselect day
          : [...prev.days, day], // Select day
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated) {
      try {
        const reminderData = {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          times: formData.times.filter(time => time !== ""),
          days: formData.days,
          notes: ""
        };
        // The current image URL needs to be preserved if a new one isn't uploaded.
        if (!formData.image && editingReminderId) {
          const existingReminder = reminders.find(r => r.id === editingReminderId);
          reminderData.image = existingReminder.image;
        }

        if (formData.image) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            reminderData.image = reader.result;
            await saveOrUpdateReminder(reminderData);
          };
          reader.readAsDataURL(formData.image);
        } else {
          await saveOrUpdateReminder(reminderData);
        }
      } catch (error) {
        alert('Error saving reminder. Please try again.');
      }
    } else {
      setReminders((prev) => [...prev, { ...formData, id: Date.now() }]);
      resetForm();
      alert('Please login to save your reminders permanently.');
      // Removed notification for unauthenticated users
    }
  };

  const saveOrUpdateReminder = async (reminderData) => {
    if (editingReminderId) {
      // Update existing reminder
      try {
        const response = await updateMedicineReminderApi(editingReminderId, reminderData);
        if (response.data.success) {
          await fetchReminders();
          resetForm();
          setEditingReminderId(null);
          alert('Reminder updated successfully!');
        }
      } catch (error) {
        alert('Error updating reminder. Please try again.');
      }
    } else {
      // Save new reminder
      try {
        const response = await saveMedicineReminderApi(reminderData);
        if (response.data.success) {
          // Schedule push notifications for each time slot
          if (pushSubscription && reminderData.times && reminderData.times.length > 0) {
            for (const time of reminderData.times) {
              if (time) {
                const reminderTime = new Date(`${reminderData.startDate}T${time}`);
                try {
                  await scheduleReminder({
                    title: 'Medicine Reminder',
                    body: `Time to take ${reminderData.name}`,
                    time: reminderTime,
                    subscription: pushSubscription
                  });
                } catch (err) {
                  console.error('Failed to schedule reminder:', err);
                }
              }
            }
          }
          
          await fetchReminders();
          resetForm();
          alert('Reminder saved successfully!');
          showBrowserNotification('Medicine Reminder Set!', {
            body: `You have set a reminder for ${reminderData.name}.`,
            icon: '/images/Medtrax-logo.png',
          });
        }
      } catch (error) {
        alert('Error saving reminder. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
      startDate: "",
      endDate: "",
      times: [""],
      days: [],
    });
    setShowForm(false);
    setEditingReminderId(null);
  };

  const handleAddNew = () => {
    // Reset form for adding a new reminder
    resetForm();
    setShowForm(true);
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.times];
    updatedTimes[index] = value;
    setFormData((prev) => ({ ...prev, times: updatedTimes }));
  };

  const handleAddTimeSlot = () => {
    if (formData.times.length < 3) {
      setFormData((prev) => ({
        ...prev,
        times: [...prev.times, ""],
      }));
    }
  };
  const handleDeleteReminder = async (index, reminderId) => {
    if (isAuthenticated && reminderId) {
      try {
        const response = await deleteMedicineReminderApi(reminderId);
        if (response.data.success) {
          await fetchReminders();
          alert('Reminder deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting reminder. Please try again.');
      }
    } else {
      setReminders((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleEditReminder = (reminder) => {
    setFormData({
      name: reminder.name || '',
      image: null, // Don't prefill file input
      startDate: reminder.startDate ? reminder.startDate.slice(0, 10) : '',
      endDate: reminder.endDate ? reminder.endDate.slice(0, 10) : '',
      times: reminder.times || [''],
      days: reminder.days || [],
    });
    setEditingReminderId(reminder.id);
    setShowForm(true);
  };

  return (
    <div className="medical-reminder-container">
      <div className="rembanner">
        <h1>
          Medication Made Simple - Set, Forget, and Get Notified!
          <br />
        </h1>
        <img
          src="images/med_remainder_bg.png"
          alt="Health tracker illustration"
          className="rembanner-image"
        />
      </div>

      {/* User Status Indicator */}
      <div className="user-status-indicator" style={{
        textAlign: 'center',
        padding: '10px',
        margin: '20px',
        backgroundColor: isAuthenticated ? '#e8f5e8' : '#fff3cd',
        border: `1px solid ${isAuthenticated ? '#d4edda' : '#ffeaa7'}`,
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        {isAuthenticated ? (
          <span style={{ color: '#155724' }}>
            ✓ Logged in as {user?.name || 'User'} - Your medicine reminders will be saved permanently
          </span>
        ) : (
          <span style={{ color: '#856404' }}>
            ⚠️ You're browsing as a guest - Please log in to save your medicine reminders permanently
          </span>
        )}
      </div>

      <div className="reminder-container20">
        <div className="reminder-section20">
          <h2>Medicines Reminder</h2>
          <div className="rem-button-group20">
            <button className="remadd-btn20" onClick={handleAddNew}>
              Add New
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="reminderinp-section20">
          <form onSubmit={handleSubmit}>
            <div className="reminderinp-group20">
              <div className="reminderinp-field20">
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter medicine name"
                  required
                />
              </div>

              <div className="reminderinp-field20">
                <label htmlFor="image">Image: </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                // `required` is problematic for updates, let's remove it
                // required
                />
              </div>

              {editingReminderId && (
                <div className="current-image-preview">
                  <span>Current Image:</span>
                  <img
                    src={reminders.find(r => r.id === editingReminderId)?.image}
                    alt="Current"
                    style={{ width: '50px', height: '50px', marginLeft: '10px' }}
                  />
                </div>
              )}

              <div className="reminderinp-field20">

                <label htmlFor="startDate">Start Date: </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="reminderinp-field20">

                <label htmlFor="endDate">End Date: </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {formData.times.map((time, index) => (
                <div key={index} className="reminderinp-field20">
                  <label htmlFor={`time-${index}`}>Time {index + 1}: </label>
                  <input
                    type="time"
                    id={`time-${index}`}
                    name={`time-${index}`}
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required={index === 0 || formData.times[index - 1] !== ""}
                    disabled={index > 0 && formData.times[index - 1] === ""}
                  />
                  {index === formData.times.length - 1 &&
                    index < 2 && // Only allow adding up to 3 slots
                    formData.times[index] !== "" && (
                      <button
                        type="button"
                        className="add-time-btn"
                        onClick={handleAddTimeSlot}
                      >
                        +
                      </button>
                    )}
                </div>
              ))}

              <div className="days-selection-container">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`day-circle ${formData.days.includes(day) ? "selected" : ""
                      }`}
                    onClick={() => handleDaySelection(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="remsav-btn20">
              {editingReminderId ? 'Update' : 'Save'}
            </button>
            {editingReminderId && (
              <button type="button" className="remcancel-btn20" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {activeReminders.length > 0 && (
        <div className="reminder-display20">
          <h2>Your Reminders</h2>
          {activeReminders.map((reminder, index) => (
            <div key={reminder.id || index} className="reminder-section20">
              <h3>{reminder.name}</h3>
              {reminder.image && (
                <img
                  src={reminder.image}
                  alt={reminder.name}
                  className="rem-image-icon20"
                />
              )}
              <p>
                <strong>Start Date:</strong> {new Date(reminder.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong> {new Date(reminder.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time Slots:</strong> {reminder.times.join(", ")}
              </p>
              <p>
                <strong>Days:</strong> {reminder.days.join(", ")}
              </p>
              <div className="abcd">
                <button
                  className="rem-delete-btn20"
                  onClick={() => handleDeleteReminder(index, reminder.id)}
                >
                  Delete
                </button>
                <button
                  className="remedit-btn20"
                  onClick={() => handleEditReminder(reminder)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedReminders.length > 0 && (
        <div className="reminder-display20 completed-section">
          <h2>Completed Reminders</h2>
          {completedReminders.map((reminder, index) => (
            <div key={reminder.id || index} className="reminder-section20">
              <h3>{reminder.name}</h3>
              {reminder.image && (
                <img
                  src={reminder.image}
                  alt={reminder.name}
                  className="rem-image-icon20"
                />
              )}
              <p>
                <strong>Completed On:</strong> {new Date(reminder.endDate).toLocaleDateString()}
              </p>
              <button
                className="rem-delete-btn20"
                onClick={() => handleDeleteReminder(index, reminder.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedReminder;