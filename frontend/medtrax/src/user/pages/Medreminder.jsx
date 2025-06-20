import React, { useState } from "react";
import "../css/Medreminder.css";

const MedReminder = () => {
  const [reminders, setReminders] = useState([]); // Store saved reminders
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    startDate: "",
    endDate: "",
    times: [""], // Initialize with one time slot
    days: [],
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Fetch reminders from the database on component mount
  // useEffect(() => {
  //   const fetchReminders = async () => {
  //     const savedReminders = await getRemindersFromDatabase();
  //     setReminders(savedReminders);
  //   };

  //   fetchReminders();
  // }, []);

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

  const handleSubmit =  (e) => {
    e.preventDefault();

    // Save new reminder to the database
    // const savedReminder = await saveReminderToDatabase(formData);

    // if (savedReminder) {
      // Add the saved reminder to the local state
      setReminders((prev) => [...prev, formData]);

      // Reset form data and hide the form
      setFormData({
        name: "",
        image: null,
        startDate: "",
        endDate: "",
        times: [""],
        days: [],
      });
      setShowForm(false);
     };
    //  else {
    //   alert("Failed to save the reminder. Please try again.");
    // }
  // };

  const handleAddNew = () => {
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
    const response = await deleteReminderFromDatabase(reminderId);

    if (response.success) {
      setReminders((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert("Failed to delete the reminder. Please try again.");
    }
  };

  // Mock function to fetch reminders from the database
  // const getRemindersFromDatabase = async () => {
  //   try {
  //     const response = await fetch("https://example.com/api/reminders");
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching reminders:", error);
  //     return [];
  //   }
  // };

  // Mock function to save reminder to the database
  const saveReminderToDatabase = async (reminder) => {
    try {
      const response = await fetch("https://example.com/api/reminders", {
        method: "POST",
        body: JSON.stringify(reminder),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const savedReminder = await response.json();
        return savedReminder;
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
    return null;
  };

  // Mock function to delete reminder from the database
  const deleteReminderFromDatabase = async (reminderId) => {
    try {
      const response = await fetch(`https://example.com/api/reminders/${reminderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error deleting reminder:", error);
      return { success: false };
    }
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
                  required
                />
              </div>

              <div className="reminderinp-field20">
                <img
                  src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                  alt="Calendar"
                  className="image-icon20"
                />
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
                    className={`day-circle ${
                      formData.days.includes(day) ? "selected" : ""
                    }`}
                    onClick={() => handleDaySelection(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="remsav-btn20">
              Save Reminder
            </button>
          </form>
        </div>
      )}

      {reminders.length > 0 && (
        <div className="reminder-display20">
          <h2>Your Saved Reminders</h2>
          {reminders.map((reminder, index) => (
            <div key={index} className="reminder-section20">
              <h3>{reminder.name}</h3>
              {reminder.image && (
                <img
                  src={URL.createObjectURL(reminder.image)}
                  alt={reminder.name}
                  className="rem-image-icon20"
                />
              )}
              <p>
                <strong>Start Date:</strong> {reminder.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {reminder.endDate}
              </p>
              <p>
                <strong>Time Slots:</strong> {reminder.times.join(", ")}
              </p>
              <p>
                <strong>Days:</strong> {reminder.days.join(", ")}
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
