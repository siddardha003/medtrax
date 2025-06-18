import React, { useState } from "react";

const SearchBar = () => {
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Sample options for dropdowns
    const treatmentOptions = ["General Checkup", "Dental Care", "Surgery", "Pediatrics"];
    const locationOptions = ["New York", "Los Angeles", "Chicago", "Current Location"];
    const dateOptions = ["Today", "Tomorrow", "Next Week"];
    const timeOptions = ["Morning", "Afternoon", "Evening"];

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown); // Toggle open/close state
    };

    const renderDropdown = (options, selectedValue, setSelectedValue, placeholder, dropdownKey) => (
        <div style={styles.dropdownContainer}>
            <div
                style={styles.dropdown}
                onClick={() => toggleDropdown(dropdownKey)} // Toggle this dropdown
            >
                {selectedValue || placeholder}
            </div>
            {openDropdown === dropdownKey && (
                <div style={styles.dropdownOptions}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            style={styles.dropdownOption}
                            onClick={() => {
                                setSelectedValue(option); // Set the selected value
                                setOpenDropdown(null); // Close the dropdown
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.searchBar}>
                {renderDropdown(treatmentOptions, selectedTreatment, setSelectedTreatment, "Hospital Name", "treatment")}
                <div style={styles.divider} />
                {renderDropdown(locationOptions, selectedLocation, setSelectedLocation, "Location", "location")}
                <div style={styles.divider} />
                <button style={styles.searchButton}>Search</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "20px 0",
    },
    searchBar: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "50px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "80%",
        maxWidth: "1200px",
        padding: "10px 20px",
        position: "relative",
    },
    dropdownContainer: {
        position: "relative",
        flex: 1,
        padding: "0 10px",
    },
    dropdown: {
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        cursor: "pointer",
        fontSize: "14px",
        color: "#555",
    },
    dropdownOptions: {
        position: "absolute",
        top: "40px",
        left: "0",
        right: "0",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
        zIndex: 1000,
    },
    dropdownOption: {
        padding: "10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        color: "#555",
    },
    divider: {
        width: "1px",
        height: "30px",
        backgroundColor: "#eee",
    },
    searchButton: {
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "30px",
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        marginLeft: "10px",
    },
};

export default SearchBar;
