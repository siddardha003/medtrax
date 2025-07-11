import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../../hooks/useAuth';
import {
  saveWeightDataApi,
  getWeightHistoryApi,
  getLatestWeightApi,
  saveHormoneDataApi,
  getHormoneHistoryApi,
  getLatestHormoneApi,
  saveSleepDataApi,
  getSleepHistoryApi,
  getLatestSleepApi,
  saveHeadacheDataApi,
  getHeadacheHistoryApi,
  getLatestHeadacheApi,
  saveStressDataApi,
  getStressHistoryApi,
  getLatestStressApi,
  saveStomachDataApi,
  getStomachHistoryApi,
  getLatestStomachApi
} from '../../Api';
// import { Link } from 'react-router-dom';
import '../css/HealthTracker.css';

const HealthTracker = () => {
  const { isAuthenticated, user } = useAuth();

  // weight tracker
  const [isActive, setIsActive] = useState(0);
  const [weight, setWeight] = useState(null); // Initially no weight
  const [lastChecked, setLastChecked] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [date, setDate] = useState("");
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [showHistory, setShowHistory] = useState(false); // Control history visibility
  const [historyData, setHistoryData] = useState([]); // Store history data from backend

  // Load latest weight on component mount for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      loadLatestWeight();
    }
  }, [isAuthenticated]);

  const loadLatestWeight = async () => {
    try {
      const response = await getLatestWeightApi();
      if (response.data.success && response.data.data) {
        const latestData = response.data.data;
        setWeight(latestData.weight);
        setLastChecked(new Date(latestData.date).toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Error loading latest weight:', error);
    }
  };

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (isAuthenticated) {
        try {
          const response = await getWeightHistoryApi({ limit: 10 });
          if (response.data.success) {
            console.log('Weight history raw data:', response.data.data);
            const formattedData = response.data.data
              .sort((a, b) => {
                // Sort by date descending, then by _id descending
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                // If dates are equal, compare _id as strings (MongoDB ObjectId)
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date: new Date(item.date).toISOString().split('T')[0],
                weight: item.weight.toString()
              }));
            setHistoryData(formattedData);
          }
        } catch (error) {
          console.error('Error fetching weight history:', error);
          setHistoryData([]);
        }
      } else {
        setHistoryData([]);
      }
    };

    if (showHistory) {
      fetchHistoryData(); // Fetch data only when history is clicked
    }
  }, [showHistory, isAuthenticated]);

  const handleSave = async () => {
    if (newWeight && date) {
      if (isAuthenticated) {
        try {
          const response = await saveWeightDataApi({
            weight: parseFloat(newWeight),
            date: date,
            unit: 'kg'
          });
          
          if (response.data.success) {
            setWeight(newWeight);
            setLastChecked(date);
            setNewWeight("");
            setDate("");
            setShowForm(false);
            setShowHistory(false);
            // Show success message
            alert('Weight data saved successfully!');
          }
        } catch (error) {
          console.error('Error saving weight data:', error);
          alert('Error saving weight data. Please try again.');
        }
      } else {
        // For non-authenticated users, just update local state
        setWeight(newWeight);
        setLastChecked(date);
        setNewWeight("");
        setDate("");
        setShowForm(false);
        setShowHistory(false);
        alert('Please login to save your data permanently.');
      }
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setShowHistory(false); // Hide history when adding new data
  };

  const handleShowHistory = () => {
    setShowForm(false); // Hide form when showing history
    setShowHistory(true); // Show history
  };
  // hormone tracker
  const [hormones, setHormones] = useState({
    FSH: "",
    LH: "",
    testosterone: "",
    thyroid: "",
    prolactin: "",
    avgBloodGlucose: "",
  });
  const [date1, setDate1] = useState("");
  const [lastChecked1, setLastChecked1] = useState(null); // Store last Checked1 data
  const [showForm1, setShowForm1] = useState(false); // Control Form1 visibility
  const [historyData1, setHistoryData1] = useState([]); // Store history Data1 from backend
  const [showHistory1, setShowHistory1] = useState(false); // Control History1 visibility
  
  useEffect(() => {
    const fetchHormoneHistory = async () => {
      if (isAuthenticated) {
        try {
          const response = await getHormoneHistoryApi({ limit: 10 });
          if (response.data.success) {
            const formattedData = response.data.data
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date1: new Date(item.date).toISOString().split('T')[0],
                FSH: item.FSH || 0,
                LH: item.LH || 0,
                testosterone: item.testosterone || 0,
                thyroid: item.thyroid || 0,
                prolactin: item.prolactin || 0,
                avgBloodGlucose: item.avgBloodGlucose || 0,
              }));
            setHistoryData1(formattedData);
            if (formattedData.length > 0) {
              setLastChecked1(formattedData[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching hormone history:', error);
          setHistoryData1([]);
          setLastChecked1(null);
        }
      } else {
        setHistoryData1([]);
        setLastChecked1(null);
      }
    };

    if (showHistory1) {
      fetchHormoneHistory();
    }
  }, [showHistory1, isAuthenticated]);

  const handleSave1 = async () => {
    if (date1 && Object.values(hormones).some(value => value !== "")) {
      const flatHormoneObj = {
        date1: date1,
        FSH: hormones.FSH,
        LH: hormones.LH,
        testosterone: hormones.testosterone,
        thyroid: hormones.thyroid,
        prolactin: hormones.prolactin,
        avgBloodGlucose: hormones.avgBloodGlucose,
      };
      if (isAuthenticated) {
        try {
          const response = await saveHormoneDataApi({
            date: date1,
            FSH: hormones.FSH ? parseFloat(hormones.FSH) : undefined,
            LH: hormones.LH ? parseFloat(hormones.LH) : undefined,
            testosterone: hormones.testosterone ? parseFloat(hormones.testosterone) : undefined,
            thyroid: hormones.thyroid ? parseFloat(hormones.thyroid) : undefined,
            prolactin: hormones.prolactin ? parseFloat(hormones.prolactin) : undefined,
            avgBloodGlucose: hormones.avgBloodGlucose ? parseFloat(hormones.avgBloodGlucose) : undefined,
          });
          if (response.data.success) {
            setLastChecked1(flatHormoneObj);
            setHormones({
              FSH: "", LH: "", testosterone: "", thyroid: "", prolactin: "", avgBloodGlucose: "",
            });
            setDate1("");
            setShowForm1(false);
            setShowHistory1(false);
            alert('Hormone data saved successfully!');
          }
        } catch (error) {
          console.error('Error saving hormone data:', error);
          alert('Error saving hormone data. Please try again.');
        }
      } else {
        // For non-authenticated users, just update local state
        setLastChecked1(flatHormoneObj);
        setHormones({
          FSH: "", LH: "", testosterone: "", thyroid: "", prolactin: "", avgBloodGlucose: "",        });
        setDate1("");
        setShowForm1(false);
        setShowHistory1(false);
        alert('Please login to save your data permanently.');
      }
    }
  };

  const handleAddNew1 = () => {
    setShowForm1(true);
    setShowHistory1(false); // Hide History1 when adding new Data1
  };

  const handleShowHistory1 = () => {
    setShowForm1(false); // Hide Form1 when showing History1
    setShowHistory1(true); // Show History1
  };
  const handleHormoneChange = (e) => {
    const { name, value } = e.target;
    setHormones((prevHormones) => ({
      ...prevHormones,
      [name]: value,
    }));
  };

  //headache tracker

  const [date2, setDate2] = useState("");
  const [severity2, setSeverity2] = useState("");
  const [lastChecked2, setLastChecked2] = useState(null);
  const [showForm2, setShowForm2] = useState(false);
  const [showHistory2, setShowHistory2] = useState(false);
  const [historyData2, setHistoryData2] = useState([]);

  useEffect(() => {
    const fetchHeadacheHistory = async () => {
      if (isAuthenticated) {
        try {
          const response = await getHeadacheHistoryApi({ limit: 10 });
          if (response.data.success) {
            const formattedData = response.data.data
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date2: new Date(item.date).toISOString().split('T')[0],
                severity2: item.severity,
              }));
            setHistoryData2(formattedData);
          }
        } catch (error) {
          console.error('Error fetching headache history:', error);
          setHistoryData2([]);
        }
      } else {
        setHistoryData2([]);
      }
    };

    if (showHistory2) {
      fetchHeadacheHistory();
    }
  }, [showHistory2, isAuthenticated]);

  const handleSave2 = async () => {
    if (!date2) {
      alert('Please select a date.');
      return;
    }
    if (!severity2) {
      alert('Please select a headache severity.');
      return;
    }
    if (severity2 === "None") {
      alert('No headache to record.');
      return;
    }    if (isAuthenticated) {
      try {
        const headacheData = {
          date: date2,
          severity: severity2.toLowerCase(), // Convert to lowercase for backend
        };
        await saveHeadacheDataApi(headacheData);
        const newEntry = { date2, severity2 };
        setLastChecked2(newEntry);
        setHistoryData2((prevHistory2) => [...prevHistory2, newEntry]);
        setShowForm2(false);
        alert('Headache data saved successfully!');
      } catch (error) {
        console.error('Error saving headache data:', error);
        alert('Error saving headache data. Please try again.');
      }
    } else {
      // For non-authenticated users, just update local state
      const newEntry = { date2, severity2 };
      setLastChecked2(newEntry);
      setHistoryData2((prevHistory2) => [...prevHistory2, newEntry]);
      setShowForm2(false);
      alert('Please log in to save your data permanently.');
    }
  };

  const handleAddNew2 = () => {
    setShowForm2(true); // Show the Form2
    setShowHistory2(false); // Hide History2
  };

  const handleShowHistory2 = () => {
    setShowHistory2(true); // Show History2
    setShowForm2(false); // Hide Form2
  };
  const handleSeverityChange2 = (level) => {
    setSeverity2(level); // Update severity2
  };

  // stress tracker
  const [date3, setDate3] = useState("");
  const [severity3, setSeverity3] = useState("");
  const [lastChecked3, setLastChecked3] = useState(null);
  const [showForm3, setShowForm3] = useState(false);
  const [showHistory3, setShowHistory3] = useState(false);
  const [historyData3, setHistoryData3] = useState([]);

  useEffect(() => {
    const fetchStressHistory = async () => {
      if (isAuthenticated) {
        try {
          const response = await getStressHistoryApi({ limit: 10 });
          if (response.data.success) {
            const formattedData = response.data.data
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date3: new Date(item.date).toISOString().split('T')[0],
                severity3: item.severity,
              }));
            setHistoryData3(formattedData);
          }
        } catch (error) {
          console.error('Error fetching stress history:', error);
          setHistoryData3([]);
        }
      } else {
        setHistoryData3([]);
      }
    };

    if (showHistory3) {
      fetchStressHistory();
    }
  }, [showHistory3, isAuthenticated]);

  const handleSave3 = async () => {
    if (!date3) {
      alert('Please select a date.');
      return;
    }
    if (!severity3) {
      alert('Please select a stress severity.');
      return;
    }
    if (severity3 === "None") {
      alert('No stress to record.');
      return;
    }
    
    if (isAuthenticated) {
      try {
        const stressData = {
          date: date3,
          severity: severity3.toLowerCase(), // Convert to lowercase for backend
        };
        await saveStressDataApi(stressData);
        const newEntry = { date3, severity3 };
        setLastChecked3(newEntry);
        setHistoryData3((prevHistory3) => [...prevHistory3, newEntry]);
        setShowForm3(false);
        alert('Stress data saved successfully!');
      } catch (error) {
        console.error('Error saving stress data:', error);
        alert('Error saving stress data. Please try again.');
      }
    } else {
      // For non-authenticated users, just update local state
      const newEntry = { date3, severity3 };
      setLastChecked3(newEntry);
      setHistoryData3((prevHistory3) => [...prevHistory3, newEntry]);
      setShowForm3(false);
      alert('Please log in to save your data permanently.');
    }
  };

  const handleAddNew3 = () => {
    setShowForm3(true); // Show the Form2
    setShowHistory3(false); // Hide History2
  };

  const handleShowHistory3 = () => {
    setShowHistory3(true); // Show History2
    setShowForm3(false); // Hide Form2
  };

  const handleSeverityChange3 = (level) => {
    setSeverity3(level); // Update severity3
  };

  // stomach

  const [date4, setDate4] = useState("");
  const [severity4, setSeverity4] = useState("");
  const [lastChecked4, setLastChecked4] = useState(null);
  const [showForm4, setShowForm4] = useState(false);
  const [showHistory4, setShowHistory4] = useState(false);
  const [historyData4, setHistoryData4] = useState([]);

  useEffect(() => {
    const fetchStomachHistory = async () => {
      if (isAuthenticated) {
        try {
          const response = await getStomachHistoryApi({ limit: 10 });
          if (response.data.success) {
            const formattedData = response.data.data
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date4: new Date(item.date).toISOString().split('T')[0],
                severity4: item.severity,
              }));
            setHistoryData4(formattedData);
          }
        } catch (error) {
          console.error('Error fetching stomach history:', error);
          setHistoryData4([]);
        }
      } else {
        setHistoryData4([]);
      }
    };

    if (showHistory4) {
      fetchStomachHistory();
    }
  }, [showHistory4, isAuthenticated]);

  const handleSave4 = async () => {
    if (!date4) {
      alert('Please select a date.');
      return;
    }
    if (!severity4) {
      alert('Please select a stomach issue severity.');
      return;
    }
    if (severity4 === "None") {
      alert('No stomach issues to record.');
      return;
    }
    
    if (isAuthenticated) {
      try {
        const stomachData = {
          date: date4,
          severity: severity4.toLowerCase(), // Convert to lowercase for backend
        };
        await saveStomachDataApi(stomachData);
        const newEntry = { date4, severity4 };
        setLastChecked4(newEntry);
        setHistoryData4((prevHistory4) => [...prevHistory4, newEntry]);
        setShowForm4(false);
        alert('Stomach data saved successfully!');
      } catch (error) {
        console.error('Error saving stomach data:', error);
        alert('Error saving stomach data. Please try again.');      }
    } else {
      // For non-authenticated users, just update local state
      const newEntry = { date4, severity4 };
      setLastChecked4(newEntry);
      setHistoryData4((prevHistory4) => [...prevHistory4, newEntry]);
      setShowForm4(false);
      alert('Please log in to save your data permanently.');
    }
  };

  const handleAddNew4 = () => {
    setShowForm4(true); // Show the Form2
    setShowHistory4(false); // Hide History2
  };

  const handleShowHistory4 = () => {
    setShowHistory4(true); // Show History2
    setShowForm4(false); // Hide Form2
  };

  const handleSeverityChange4 = (level) => {
    setSeverity4(level); // Update severity4
  };


  //sleep cycle

  const [sleep, setSleep] = useState(null); // Initially no sleep
  const [lastChecked5, setLastChecked5] = useState("");
  const [newSleep, setNewSleep] = useState("");
  const [date5, setDate5] = useState("");
  const [showForm5, setShowForm5] = useState(false); // Control form visibility
  const [showHistory5, setShowHistory5] = useState(false); // Control history visibility
  const [historyData5, setHistoryData5] = useState([]);

  useEffect(() => {
    const fetchSleepHistory = async () => {
      if (isAuthenticated) {
        try {
          const response = await getSleepHistoryApi({ limit: 10 });
          if (response.data.success) {
            const formattedData = response.data.data
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return b._id.localeCompare(a._id);
              })
              .map(item => ({
                date5: new Date(item.date).toISOString().split('T')[0],
                sleep: item.hoursSlept || item.sleep || 0,
              }));
            setHistoryData5(formattedData);
          }
        } catch (error) {
          console.error('Error fetching sleep history:', error);
          setHistoryData5([]);
        }
      } else {
        setHistoryData5([]);
      }
    };

    if (showHistory5) {
      fetchSleepHistory();
    }
  }, [showHistory5, isAuthenticated]);

  const handleSave5 = async () => {
    if (newSleep && date5) {
      if (isAuthenticated) {
        try {
          const sleepData = {
            date: date5,
            hoursSlept: parseFloat(newSleep),
            sleepQuality: 'good', // Default value, you may want to make this user-selectable
          };
          await saveSleepDataApi(sleepData);
          setSleep(newSleep);
          setLastChecked5({ date5: date5, sleep: parseFloat(newSleep) });
          setNewSleep("");
          setDate5("");
          setShowForm5(false);
          setShowHistory5(false);
          alert('Sleep data saved successfully!');
        } catch (error) {
          console.error('Error saving sleep data:', error);
          alert('Error saving sleep data. Please try again.');
        }
      } else {
        // For non-authenticated users, just update local state
        setSleep(newSleep);
        setLastChecked5({ date5: date5, sleep: parseFloat(newSleep) });
        setNewSleep("");
        setDate5("");
        setShowForm5(false);
        setShowHistory5(false);
        alert('Please log in to save your data permanently.');
      }
    }
  };

  const handleAddNew5 = () => {
    setShowForm5(true);
    setShowHistory5(false); // Hide history when adding new data
  };

  const handleShowHistory5 = () => {
    setShowForm5(false); // Hide form when showing history
    setShowHistory5(true); // Show history
  };

  // Fetch latest entries for all trackers on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    // Weight
    getLatestWeightApi().then(response => {
      if (response.data.success && response.data.data) {
        const latestData = response.data.data;
        setWeight(latestData.weight);
        setLastChecked(new Date(latestData.date).toISOString().split('T')[0]);
      }
    }).catch(e => console.error('Error loading latest weight:', e));

    // Hormone
    getLatestHormoneApi().then(response => {
      if (response.data.success && response.data.data) {
        const item = response.data.data;
        setLastChecked1({
          date1: new Date(item.date).toISOString().split('T')[0],
          FSH: item.FSH || 0,
          LH: item.LH || 0,
          testosterone: item.testosterone || 0,
          thyroid: item.thyroid || 0,
          prolactin: item.prolactin || 0,
          avgBloodGlucose: item.avgBloodGlucose || 0,
        });
      } else {
        setLastChecked1(null);
      }
    }).catch(e => setLastChecked1(null));

    // Headache
    getLatestHeadacheApi().then(response => {
      if (response.data.success && response.data.data) {
        const item = response.data.data;
        setLastChecked2({
          date2: new Date(item.date).toISOString().split('T')[0],
          severity2: item.severity,
        });
      } else {
        setLastChecked2(null);
      }
    }).catch(e => setLastChecked2(null));

    // Stress
    getLatestStressApi().then(response => {
      if (response.data.success && response.data.data) {
        const item = response.data.data;
        setLastChecked3({
          date3: new Date(item.date).toISOString().split('T')[0],
          severity3: item.severity,
        });
      } else {
        setLastChecked3(null);
      }
    }).catch(e => setLastChecked3(null));

    // Stomach
    getLatestStomachApi().then(response => {
      if (response.data.success && response.data.data) {
        const item = response.data.data;
        setLastChecked4({
          date4: new Date(item.date).toISOString().split('T')[0],
          severity4: item.severity,
        });
      } else {
        setLastChecked4(null);
      }
    }).catch(e => setLastChecked4(null));

    // Sleep
    getLatestSleepApi().then(response => {
      if (response.data.success && response.data.data) {
        const item = response.data.data;
        setLastChecked5({
          date5: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          sleep: item.hoursSlept !== undefined ? item.hoursSlept : (item.sleep !== undefined ? item.sleep : null)
        });
      } else {
        setLastChecked5(null);
      }
    }).catch(e => setLastChecked5(null));

  }, [isAuthenticated]);

  // Ensure we're still inside the main HealthTracker function
  return (
    <section id="department">
      <div className="st-height-b120 st-height-lg-b80" />
      <SectionHeading title=''
        subTitle=
        "" />
      
      {/* User Status Indicator */}
      <div className="container">
        <div className="user-status-indicator" style={{
          textAlign: 'center',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: isAuthenticated ? '#e8f5e8' : '#fff3cd',
          border: `1px solid ${isAuthenticated ? '#d4edda' : '#ffeaa7'}`,
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          {isAuthenticated ? (
            <span style={{ color: '#155724' }}>
              ✓ Logged in as {user?.name || 'User'} - Your health data will be saved permanently
            </span>
          ) : (
            <span style={{ color: '#856404' }}>
              ⚠️ You're browsing as a guest - Please log in to save your health data permanently
            </span>
          )}
        </div>
      </div>

      <div className="container">
        <div className="st-tabs st-fade-tabs st-style1">
          <ul className="st-tab-links st-style1 st-mp0">
            <li className={`st-tab-title ${isActive === 0 ? "active" : ""}`} onClick={() => setIsActive(0)}>
              <span className="st-blue-box">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                  viewBox="0 0 512 512" height="35px">
                  <g>
                    <g>


                      <path d="M467.639,0H44.361C19.9,0,0,19.9,0,44.361v423.278C0,492.1,19.9,512,44.361,512h423.278C492.1,512,512,492.1,512,467.639
			V44.361C512,19.9,492.1,0,467.639,0z M15.637,103.796h125.165c-1.341,2.727-2.586,5.508-3.734,8.34H15.637V103.796z
			 M467.639,496.363H44.361c-15.839,0-28.724-12.885-28.724-28.724V127.773h116.242c-2.678,10.278-4.106,21.054-4.106,32.157v24.138
			h256.453V159.93c0-11.103-1.428-21.878-4.106-32.157h116.242v339.866h0.001C496.363,483.476,483.477,496.363,467.639,496.363z
			 M144.485,144.453c3.345-24.083,14.376-45.748,30.541-62.445L188.2,95.182l11.056-11.058l-12.591-12.59
			c17.073-13.344,38.092-21.884,60.994-23.563v21.424h15.637V47.904c23.306,1.494,44.705,10.084,62.037,23.63l-12.591,12.59
			l11.056,11.058l13.174-13.174c16.165,16.697,27.197,38.362,30.541,62.445h-23.945v15.637h25.02v8.34H263.295v-16.68h-15.637v16.68
			H143.408v-8.34h25.02v-15.637H144.485z M496.363,112.136h-121.43c-1.148-2.831-2.394-5.613-3.734-8.34h125.165V112.136z
			 M496.363,88.158H362.083c-23.093-33.855-62.028-56.135-106.084-56.135c-44.056,0-82.991,22.28-106.084,56.135H15.637V44.361
			c0-15.839,12.885-28.724,28.724-28.724h423.278c15.838,0,28.724,12.885,28.724,28.724V88.158z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M256,120.248c-6.021,0-11.731,1.356-16.854,3.764l-33.659-33.66L194.43,101.41l32.018,32.019
			c-6.391,7.078-10.289,16.439-10.289,26.661h15.637c0-13.552,10.858-24.205,24.205-24.205c13.347,0,24.205,10.652,24.205,24.205
			h15.637C295.842,138.198,277.969,120.248,256,120.248z"/>
                    </g>
                  </g>


                </svg>
                <span>Weight</span>
              </span>
            </li>
            <li className={`st-tab-title ${isActive === 1 ? "active" : ""}`} onClick={() => setIsActive(1)}>
              <span className="st-red-box">
                <svg width="35px" height="35px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#ccccc" d="M3.019 26.246l3.432 3.432l-.923.922l-3.432-3.431z"></path><path fill="#ccccc" d="M6.362 29.587l3.431 3.432l-.923.923l-3.43-3.432z"></path><path fill="#ccccc" d="M6.273 24.237l3.432 3.432l-.923.923L5.35 25.16z"></path><path fill="#ccccc" d="M8.998 26.962l3.432 3.432l-.923.923l-3.431-3.432zm3.909-9.359l3.431 3.432l-.923.923l-3.431-3.432z"></path><path fill="#ccccc" d="M15.631 20.329l3.432 3.431l-.923.923l-3.432-3.431z"></path><path fill="#ccccc" d="M14.97 14.377l3.432 3.432l-.922.923l-3.432-3.432z"></path><path fill="#ccccc" d="M18.277 17.683l3.432 3.432l-.923.923l-3.432-3.432z"></path><path fill="#ccccc" d="M17.616 11.731l3.432 3.432l-.923.922l-3.432-3.431z"></path><path fill="#ccccc" d="M20.923 15.038l3.432 3.431l-.923.923l-3.431-3.432zM24.387 4.96l3.432 3.432l-.923.922l-3.432-3.431z"></path><path fill="#ccccc" d="M27.694 8.267l3.432 3.431l-.923.923l-3.432-3.432z"></path><path fill="#ccccc" d="M27.013 2.252l3.432 3.432l-.923.923l-3.432-3.432z"></path><path fill="#ccccc" d="M30.36 5.6l3.432 3.431l-.923.923l-3.432-3.431z"></path><path fill="#ccccc" d="M24.922.812c-2.52 2.52-2.601 6.145-2.396 9.806c.501.028 1.002.061 1.502.094c.39.026.775.051 1.159.074c-.198-3.286-.199-6.299 1.606-8.104c.727-.703.955-1.653.447-2.166c-.535-.54-1.542-.497-2.318.296z"></path><path fill="#ccccc" d="M13.146 25.65l-.153-2.66c-.026-.445-.058-.899-.074-1.332c-.296-.296-2.466-.349-2.653-.162c.013.44.047.884.071 1.327c.028.502.126 2.275.149 2.66c.054.91.096 1.806.086 2.656c.259.259 2.371.437 2.645.162a36.931 36.931 0 0 0-.071-2.651z"></path><path fill="#ccccc" d="M13.22 28.3l-2.649-.162c-.026 2.209-.384 4.145-1.687 5.448a1.322 1.322 0 1 0 1.87 1.871c2.423-2.422 2.467-7.174 2.466-7.157z"></path><path fill="#ccccc" d="M25.354 13.447c-.501-.028-1.003-.061-1.503-.094c-.389-.026-.775-.051-1.158-.074c.198 3.285.199 6.299-1.607 8.104c-1.804 1.804-4.813 1.805-8.094 1.607c-.386-.023-2.159-.14-2.656-.168c-3.667-.206-7.297-.126-9.82 2.397a1.322 1.322 0 0 0 1.871 1.87c1.805-1.804 4.815-1.806 8.098-1.608c.385.023 2.161.14 2.66.168c3.662.205 7.289.125 9.811-2.396c2.521-2.52 2.603-6.145 2.398-9.806z"></path><path fill="#ccccc" d="M25.354 13.447c-.028-.501-.145-2.277-.168-2.66a51.95 51.95 0 0 1-.064-1.332c-.336-.021-2.1-.133-2.653-.163c.013.44.032.883.056 1.326c.028.501.145 2.277.168 2.661c.055.914.091 1.804.081 2.656c.333.021 2.094.132 2.645.162a36.316 36.316 0 0 0-.065-2.65z"></path><path fill="#ccccc" d="M35.581 8.827c-.42-.436-1.385-.601-2.291.353c-1.805 1.805-4.817 1.806-8.104 1.607c-.384-.023-2.16-.141-2.661-.169c-3.66-.205-7.286-.123-9.806 2.397c-2.215 2.215-2.545 5.284-2.453 8.48c.553.03 2.319.142 2.653.162c-.098-2.755.113-5.214 1.671-6.772c1.805-1.805 4.818-1.805 8.104-1.607c.383.023 2.16.14 2.661.168c3.661.205 7.286.124 9.806-2.396c.886-.869.84-1.787.42-2.223z"></path></svg>

                <span>Hormones</span>
              </span>
            </li>
            <li className={`st-tab-title ${isActive === 2 ? "active" : ""}`} onClick={() => setIsActive(2)}>
              <span className="st-green-box">
                <svg viewBox="-31.55 0 324.439 324.439" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#ffffff" d="M194.466,86.329a7.8,7.8,0,0,1,5.6-1.385c3.878.487,5.352,2.644,5.954,3.884,1.8,3.711,1.114,10.17-.687,14.046a20.435,20.435,0,0,1-7.488,9.287,15,15,0,0,1-7.467,1.891c-.2.626-.338,1.076-.338,1.076-.888,1.982-3.02,5.465-3.02,5.465a73.7,73.7,0,0,1-5.437,7.522q.833,3.61,1.669,7.221a27.425,27.425,0,0,0,1.7,5.546c2.512,5.34,11.388,9.424,15.425,12.269a73.886,73.886,0,0,1-47.76,17.555c-6.19,0-12.47-.79-18.24-3.37a29.22,29.22,0,0,1-12.373-10.5c3.822-1.432,7.969-2.96,10.626-4.208a10.89,10.89,0,0,0,5.942-5.478c-8.77-.22-16.5-3.15-23.944-8.929-8.8-6.827-12.829-17.847-14.5-30.1-.96-7.067-1.835-14.754-3.048-22.425,0,0-5.125-40.76,43.431-40.76C198.617,44.936,194.466,86.329,194.466,86.329Z" /><path fill="#85807f" d="M116.727,66.61a9.681,9.681,0,0,0-.409-1.753c-.447-1.364-1.563-1.87-2.36-1.367-6.8,4.281-15.847,18.671-16.492,23.774,0,0-.087.69-.22,1.7a90.09,90.09,0,0,1-1.618-30.063c1.241-8.777,4.978-18.716,10.437-25.664,9.456-12.034,23.956-19.691,42.285-21.306,11.568-1.019,23.245.688,36.1,9.084l8,5.229,1.519,1.3c7.74,6.63,11.7,14.38,14.47,23.92a48.411,48.411,0,0,1,1.91,14.79c-.16,5.28-.09,17.59-3.65,24.53a9.178,9.178,0,0,0-.672-1.961c-.6-1.24-2.076-3.4-5.954-3.884a7.8,7.8,0,0,0-5.6,1.385s-2.124-.081-3.538-.121a3.453,3.453,0,0,1-2.135-.811c-2.026-1.711-5.9-5.52-5.9-5.52-11.512-18.427-26.061-22.7-29.221-23.787,0,0-4.979-.7-10.054-.87-10.324,2.867-19.4,11.431-24.205,14.616a1.739,1.739,0,0,1-2.617-1.667A9.423,9.423,0,0,0,116.727,66.61Z" /><path fill="#211715" d="M99.78,87.9a10.425,10.425,0,0,1,.422-1.75c.114-.352.243-.7.374-1.042a10.661,10.661,0,0,1,.445-1.038,52.536,52.536,0,0,1,3.014-5.549,54.447,54.447,0,0,1,8.081-10.443,23.888,23.888,0,0,1,2.11-1.875,3.916,3.916,0,0,0,.742-.514l.2-.129a1.208,1.208,0,0,1-.994.054c-.185.091-.373-.73-.04.308.372,1.159.085,2.373.432,3.524a4.289,4.289,0,0,0,3.1,2.956c2.2.5,3.964-1.166,5.581-2.392,1.81-1.373,3.6-2.773,5.431-4.115,4.842-3.546,10.025-6.84,15.862-8.442,2.975-.817,1.712-5.449-1.276-4.629a50.037,50.037,0,0,0-15.222,7.645c-2.06,1.443-4.056,2.974-6.051,4.505-.745.572-1.491,1.144-2.248,1.7-.327.241-.656.48-.99.712a3.86,3.86,0,0,0-.549.374c-.011-.255.879.116.819.115.408.007,0,.771.18-.035a3.022,3.022,0,0,0-.036-.847,12.146,12.146,0,0,0-.405-2.348,4.881,4.881,0,0,0-2.975-3.547c-2.367-.743-4.363,1.132-6,2.591A53.7,53.7,0,0,0,100.775,74.7a57.218,57.218,0,0,0-3.67,6.461,19.375,19.375,0,0,0-1.953,5.465,2.48,2.48,0,0,0,1.676,2.952A2.416,2.416,0,0,0,99.78,87.9Z" /><path fill="#211715" d="M110.021,97.5c-.684-2.5-.192-8.229,4.122-8.665,5.7.106,5.957,7.041,4.018,10.278C116.574,101.766,111.95,102.82,110.021,97.5Z" /><path fill="#211715" d="M185.656,18.947a57.742,57.742,0,0,0-29.441-9.64,69.935,69.935,0,0,0-28.308,4.934,57.309,57.309,0,0,0-21.764,15.164,55.984,55.984,0,0,0-12.52,26.937c-1.989,11.107-1.156,23.1,1.49,34.023.727,3,5.357,1.73,4.629-1.276a83.794,83.794,0,0,1-1.9-28.677,52.1,52.1,0,0,1,9.924-25.474c10.636-13.787,28.006-20.487,45.073-20.853a53.175,53.175,0,0,1,30.4,9.006c2.6,1.686,5.009-2.468,2.423-4.144Z" /><path fill="#211715" d="M163.843,138.474c-12.03,5.906-26.359,8.983-39.049,3.176C119,139,113.568,135.082,109.973,129.756c-3.617-5.358-5.6-11.583-6.806-17.888-1.69-8.852-2.361-17.907-3.761-26.81a2.418,2.418,0,0,0-2.952-1.677,2.46,2.46,0,0,0-1.676,2.953c1.318,8.385,2.056,16.864,3.476,25.23,1.166,6.87,3.237,13.773,6.98,19.705,7.649,12.12,22.356,18.9,36.487,18.249,8.658-.4,16.811-3.1,24.545-6.9a2.425,2.425,0,0,0,.861-3.284,2.451,2.451,0,0,0-3.284-.861Z" /><path fill="#211715" d="M192.269,29.246c6.782,5.861,10.989,13.39,13.568,21.9,2.547,8.409,2.39,17.185,1.641,25.861-.364,4.216-.937,8.745-2.854,12.571-1.381,2.754,2.758,5.187,4.144,2.422,3.724-7.429,3.752-16.376,3.946-24.506a58.146,58.146,0,0,0-6.94-29.154,44.9,44.9,0,0,0-10.111-12.488c-2.327-2.011-5.736,1.37-3.394,3.394Z" /><path fill="#211715" d="M153.037,58.4c.993.341,1.987.673,2.967,1.052.342.133.681.271,1.021.41.106.044-.328-.147.1.046.239.107.478.21.716.318q1.349.614,2.658,1.31a50.545,50.545,0,0,1,12.685,9.681,61.271,61.271,0,0,1,7.634,9.867c1.641,2.608,5.8.2,4.145-2.423-6.491-10.314-15.554-18.89-26.912-23.528-1.231-.5-2.486-.931-3.743-1.361-2.929-1-4.186,3.632-1.276,4.628Z" /><path fill="#211715" d="M133.278,126.98c.2-.117.408-.229.619-.331.109-.053.221-.1.332-.152-.5.228-.074.037.04,0a13.977,13.977,0,0,1,1.527-.461q.456-.11.916-.194c.138-.025.277-.048.416-.071.239-.04.221-.025-.008,0,.6-.061,1.2-.113,1.8-.123a15.533,15.533,0,0,1,1.657.058c.056,0,.5.044.179.012s.11.018.168.028c.281.047.56.1.837.174q.37.093.732.219c.143.05.284.1.425.16-.243-.094-.043-.021.084.034.8.349,1.588.708,2.394,1.034a2.408,2.408,0,0,0,2.953-1.677,2.473,2.473,0,0,0-1.677-2.952l-.23-.093q.228.094,0,0l-.455-.2c-.333-.149-.666-.3-1-.439a12.9,12.9,0,0,0-2.128-.752,16.332,16.332,0,0,0-4.147-.395,16.8,16.8,0,0,0-7.855,1.99,2.4,2.4,0,1,0,2.423,4.144Z" /><path fill="#211715" d="M146.968,96.678c-.742-2.492-.192-8.2,4.52-8.646,6.221.093,6.49,7.007,4.366,10.237C154.115,100.913,149.063,101.974,146.968,96.678Z" /><path fill="#211715" d="M129.437,102.786c-.779,1.389-1.514,2.8-2.175,4.254a5.655,5.655,0,0,0-.648,2.277,3.265,3.265,0,0,0,1.218,2.589A4.755,4.755,0,0,0,129.9,113c.508.1,1.011.111,1.52.172a2.385,2.385,0,0,0,1.7-.7,2.4,2.4,0,0,0,0-3.394l-.486-.375a2.4,2.4,0,0,0-1.211-.328c-.244-.029-.489-.031-.733-.062l.638.086a2.6,2.6,0,0,1-.628-.175l.574.242a2.962,2.962,0,0,1-.527-.322l.486.375a3.13,3.13,0,0,1-.345-.316l.376.486a.736.736,0,0,1-.093-.148l.242.573a1.139,1.139,0,0,1-.07-.249l.085.638a1.7,1.7,0,0,1,.01-.364l-.086.638a3.312,3.312,0,0,1,.2-.66l-.241.573c.668-1.532,1.458-3.017,2.275-4.474a2.4,2.4,0,1,0-4.145-2.423Z" /><path fill="#211715" d="M176.76,136.545a67.269,67.269,0,0,0,10.171-11.5,55.168,55.168,0,0,0,5.185-8.7,2.471,2.471,0,0,0-.861-3.284,2.42,2.42,0,0,0-3.283.861,59.787,59.787,0,0,1-14.606,19.235,2.4,2.4,0,1,0,3.394,3.394Z" /><path fill="#211715" d="M195.677,88.4a6.013,6.013,0,0,1,7.46.414c.079.081.441.518.326.362a4.57,4.57,0,0,0,.254.419,5.216,5.216,0,0,1,.5,1.185,13.432,13.432,0,0,1,.448,4.446c-.228,5.585-3.151,11.853-8.023,14.861-2.021,1.248-5.782,2.268-8.291,1.183a2.48,2.48,0,0,0-3.284.861,2.418,2.418,0,0,0,.861,3.284c3.927,1.7,8.342,1.1,12.154-.661,3.494-1.613,6.279-4.944,8.115-8.245A25.149,25.149,0,0,0,209.442,95.6c.2-3.508-.338-7.43-2.826-10.095-3.3-3.532-9.467-4-13.362-1.25a2.465,2.465,0,0,0-.861,3.283,2.42,2.42,0,0,0,3.284.861Z" /><path fill="#211715" d="M152.416,81.394a12.635,12.635,0,0,0,7.533,3.2,2.4,2.4,0,0,0,1.7-4.1,2.666,2.666,0,0,0-1.7-.7c-.176-.013-.35-.03-.525-.052l.638.086a10.208,10.208,0,0,1-2.577-.716l.573.242a10.405,10.405,0,0,1-2.223-1.3l.486.375c-.175-.138-.345-.28-.511-.428a2.525,2.525,0,0,0-1.7-.7,2.439,2.439,0,0,0-1.7.7,2.4,2.4,0,0,0,0,3.394Z" /><path fill="#211715" d="M168.08,94.54a51.219,51.219,0,0,0-.129,6.425c.1,1.895.154,4.206,1.306,5.811a5.953,5.953,0,0,0,6.143,2.139c2.27-.464,3.654-2.314,4.454-4.345a2.409,2.409,0,0,0-1.677-2.952,2.471,2.471,0,0,0-2.952,1.676c-.206.523.256-.45-.025.037-.069.119-.128.244-.2.362s-.4.425-.144.23c.277-.211-.078.052-.141.124-.317.359.392-.194-.038.035-.066.035-.5.262-.174.115s-.134.031-.213.051-.166.039-.25.054c-.183.032-.112.022.211-.031a3.938,3.938,0,0,0-.519,0c-.451,0,.311.095.038.006-.134-.043-.277-.073-.414-.111-.469-.129.341.252-.046-.035-.357-.264.212.248.01.033a2.149,2.149,0,0,1-.182-.175q.276.4.132.176c-.036-.09-.2-.248-.191-.352.119.289.149.347.089.176-.028-.083-.054-.166-.077-.251-.079-.282-.127-.568-.182-.854-.1-.511.052.537-.007-.075-.023-.233-.049-.465-.07-.7-.074-.839-.115-1.68-.129-2.522-.028-1.687.057-3.373.177-5.055a2.412,2.412,0,0,0-2.4-2.4,2.459,2.459,0,0,0-2.4,2.4Z" /><path fill="#ffffff" d="M52.326,173.022c-.763,1.336,10.088-17.536,14.441-29.28a20.832,20.832,0,0,0,1.217-4.534c.68-8.359-2.3-16.2-4.63-27.949-.708-3.564-2.759-8.718-2.267-12.335.554-4.073,1.081-6.839,3.034-10.543,3.973-7.534,11.016-15.415,15.166-20.726A13.036,13.036,0,0,1,85.018,63.1c2.586-1.081,6.191.3,6.561,1.242,0,0,.055.138.152.386a9.573,9.573,0,0,1,2.527-1.049c3.1-.763,6.862,2.7,5.421,6.182l0,.7a3.777,3.777,0,0,1,2.3.958c1.961,1.688,1.371,4.881-.128,7.017-1.323,1.884-3.187,4.689-5.261,7.9,2.465.113,4.753.424,5.807,1.8a4.618,4.618,0,0,1,.541,4.745c-2.353,3.9-3.872,6.265-6.221,10.766-1.415,2.709-5.142,10.283-5.581,13.244a14.341,14.341,0,0,0,.518,5.871c1.769,6.421,3.3,5.1,4.768,12.145a10.124,10.124,0,0,1-4.25,9.851c-2.135,13.544-3.4,21.881-5.025,32.2Z" /><path fill="#211715" d="M89.465,177.684c1.6-10.207,3.172-20.42,4.778-30.627a2.476,2.476,0,0,0-1.677-2.952,2.419,2.419,0,0,0-2.952,1.676c-1.606,10.207-3.173,20.42-4.777,30.627a2.475,2.475,0,0,0,1.676,2.952,2.418,2.418,0,0,0,2.952-1.676Z" /><path fill="#211715" d="M70.384,139.208c.421-5.586-.728-11.133-1.99-16.545-.752-3.226-1.547-6.442-2.239-9.682-.625-2.929-1.413-5.792-2.117-8.7a17.757,17.757,0,0,1-.134-7.941,25.711,25.711,0,0,1,3.069-8.162c3.112-5.437,7.109-10.306,11.054-15.148,1.756-2.155,3.4-4.832,5.662-6.485a6.072,6.072,0,0,1,3.746-1.436,5.6,5.6,0,0,1,1.666.35c.227.085.242.189.449.211.254.167.271.166.05,0-.173-.281-.2-.32-.093-.119,1.439,2.735,5.583.312,4.145-2.423-1.326-2.519-5.428-3.085-7.914-2.693-3.017.477-5.772,2.638-7.673,4.932C73.91,70.379,69.721,75.452,66,80.8c-3.958,5.678-6.97,11.755-7.371,18.782-.178,3.106.833,6.251,1.641,9.213.929,3.4,1.548,6.881,2.354,10.313,1.55,6.6,3.479,13.26,2.963,20.1a2.421,2.421,0,0,0,2.4,2.4,2.447,2.447,0,0,0,2.4-2.4Z" /><path fill="#211715" d="M73.513,91.942A147.189,147.189,0,0,1,86.559,73.087c2.049-2.439,4.328-5.583,7.383-6.807a2.4,2.4,0,0,1,2.683.257,2.173,2.173,0,0,1,.74,2.683,2.422,2.422,0,0,0,1.676,2.953,2.451,2.451,0,0,0,2.952-1.677c1.431-3.908-1.345-8.195-5.266-9.133-4.377-1.048-8.341,2.517-11.055,5.472-6.308,6.867-11.5,14.718-16.3,22.684-1.6,2.653,2.55,5.069,4.144,2.423Z" /><path fill="#211715" d="M78.829,101.041c2.447-4.164,5.054-8.238,7.689-12.284,1.538-2.361,3.1-4.71,4.7-7.03q1.084-1.575,2.2-3.128.478-.66.966-1.313.209-.279.419-.555c.014-.018.24-.31.081-.106-.175.226.168-.212.2-.254,1.05-1.311,3.134-4.09,4.885-3.332,2.241.971-.147,4.211-.964,5.4-3.055,4.459-5.959,9.025-8.833,13.6-3.272,5.212-6.548,10.446-9.5,15.85-1.481,2.712,2.662,5.137,4.145,2.422,2.812-5.148,5.924-10.139,9.035-15.109s6.266-9.959,9.608-14.795c1.977-2.861,3.245-6.833.861-9.878-2.731-3.488-7.247-2.623-10.27-.091a29.968,29.968,0,0,0-4.627,5.522c-1.692,2.328-3.31,4.711-4.905,7.107-3.4,5.1-6.731,10.262-9.837,15.546-1.569,2.669,2.578,5.087,4.145,2.423Z" /><path fill="#211715" d="M98.26,88.948a3.777,3.777,0,0,1,2.244.742,2.241,2.241,0,0,1,.341,2.173c.163-.381-.267.38-.31.451q-.269.444-.538.886l-.811,1.335c-.64,1.056-1.277,2.115-1.9,3.184A121.349,121.349,0,0,0,91.561,108.9a55.83,55.83,0,0,0-2.267,5.621,14.56,14.56,0,0,0-.392,6.962,23.378,23.378,0,0,0,2.193,6.661c.581,1.149,1.515,2.569,1.9,3.527.811,2.013,1.528,4.321,1.016,6.434a8.445,8.445,0,0,1-4.006,5.286c-2.657,1.57-.245,5.721,2.423,4.145a12.75,12.75,0,0,0,6.312-13.177,21.478,21.478,0,0,0-2.3-6.505,23.486,23.486,0,0,1-2.228-4.811,11.674,11.674,0,0,1-.368-7,46.861,46.861,0,0,1,2.277-5.634,127.57,127.57,0,0,1,6.63-12.491c1.6-2.661,3.493-5,2.852-8.283-.734-3.769-3.911-5.077-7.343-5.487a2.413,2.413,0,0,0-2.4,2.4,2.458,2.458,0,0,0,2.4,2.4Z" /><path fill="#211715" d="M50.254,171.81l-.038.067c-1.532,2.721,2.422,4.956,4.145,2.423a85.619,85.619,0,0,0,4.351-7.933c2.837-5.326,5.583-10.714,8.012-16.24,1.557-3.541,3.115-7.018,3.374-10.926a2.4,2.4,0,0,0-4.8,0c-.194,2.936-1.485,5.686-2.652,8.353-1.211,2.762-2.51,5.485-3.85,8.187-2.262,4.556-4.643,9.053-7.106,13.5-.48.868-.915,1.81-1.474,2.632l4.145,2.423.038-.067c1.533-2.687-2.613-5.108-4.145-2.423Z" /><path fill="#ffffff" d="M241.439,182.05c9.908,17.035,10.747,37.441,12.941,56.718,1.853,16.281,3.914,59.185,4.55,83.143-17.615.014-126.54.115-164.132.128-.392-17.316-1.172-40.541-2.441-61.287l-.68.645c-6.041,5.735-15.264,8.875-23.986,9.54s-17.914-1.684-24.4-7.977c-6-5.822-7.749-14.425-8.765-23.075s2.377-26.842,4.054-33.23c2.774-10.571,16.3-47.051,20.58-55.908a1.584,1.584,0,0,1,1.724-.913c4.953.952,22.867,4.071,32.222,5.748a2.255,2.255,0,0,1,1.742,2.56c-.395,3.1-.838,6.641-1.307,10.458l10.242-5.675a176.466,176.466,0,0,1,17.509-7.221,29.256,29.256,0,0,0,13.093,11.632c5.77,2.58,12.05,3.37,18.24,3.37a73.8,73.8,0,0,0,48.767-18.438c11.642,6.119,27.544,12.248,36.488,24.361A59,59,0,0,1,241.439,182.05Z" /><path fill="#f2635f" d="M71.638,40.841c.264.34-.3-.389-.345-.454-.154-.2-.307-.409-.46-.615q-.535-.718-1.062-1.446-1.231-1.7-2.434-3.416c-1.741-2.477-3.457-4.97-5.176-7.462-3.123-4.53-6.2-9.11-9.585-13.451a2.4,2.4,0,0,0-3.394,0c-2.636,3.147-4.984,6.524-7.555,9.722l3.77.486C39.788,16.454,33.86,8.94,28.259,1.183A2.467,2.467,0,0,0,24.976.322a2.417,2.417,0,0,0-.861,3.283c5.6,7.757,11.529,15.272,17.137,23.023.807,1.116,2.712,1.8,3.769.486,2.571-3.2,4.919-6.576,7.555-9.723H49.182q.249.32.024.03l.279.366c.145.194.292.388.436.582q.513.688,1.016,1.384,1.2,1.647,2.363,3.317c1.722,2.453,3.421,4.922,5.123,7.389,3.2,4.641,6.362,9.322,9.821,13.776a2.412,2.412,0,0,0,3.394,0,2.461,2.461,0,0,0,0-3.394Z" /><path fill="#f2635f" d="M52.893,50.544c-7.817-3.5-15.5-7.294-23.321-10.774-1.316-.585-3.175-.224-3.526,1.435-.85,4.016-1.337,8.1-2.1,12.131L27.467,51.9C19.5,47.987,11.562,44,3.6,40.075a2.461,2.461,0,0,0-3.284.861,2.422,2.422,0,0,0,.861,3.283c7.968,3.923,15.9,7.913,23.873,11.827,1.277.628,3.215.193,3.525-1.434.768-4.032,1.255-8.115,2.105-12.131l-3.526,1.434c7.825,3.479,15.505,7.276,23.322,10.773a2.474,2.474,0,0,0,3.283-.861,2.416,2.416,0,0,0-.861-3.283Z" /><path fill="#211715" d="M124.623,151.987a224.02,224.02,0,0,0-22.053,8.866,2.42,2.42,0,0,0-.861,3.283,2.453,2.453,0,0,0,3.284.861,212.023,212.023,0,0,1,20.906-8.381,2.459,2.459,0,0,0,1.676-2.952,2.423,2.423,0,0,0-2.952-1.677Z" /><path fill="#211715" d="M205.946,236.179c.341,9.128.549,18.263.8,27.4q.553,20.063,1.122,40.125.267,9.13.567,18.26c.106,3.08,4.906,3.094,4.8,0-.406-11.846-.728-23.695-1.058-35.543q-.528-18.933-1.051-37.865c-.118-4.124-.227-8.249-.381-12.372-.115-3.079-4.915-3.095-4.8,0Z" /><path fill="#211715" d="M90.194,218.628c2.04-20,4.446-39.97,6.98-59.912a4.8,4.8,0,0,0-4.215-5.588q-3.169-.567-6.338-1.126-7.157-1.266-14.312-2.53c-3.5-.622-7-1.289-10.5-1.9-2.546-.443-4.164.73-5.187,2.965-.582,1.27-1.128,2.557-1.67,3.844C48.8,168.992,43.3,183.98,38.381,199.046a129.651,129.651,0,0,0-4.627,19.337A135.2,135.2,0,0,0,32.035,232.9a58.062,58.062,0,0,0,1.13,14.055c1.044,5.506,2.877,10.936,6.37,15.39a29.154,29.154,0,0,0,13.917,9.344c10.7,3.512,23.385,1.632,33.171-3.721a33.321,33.321,0,0,0,6.751-4.878c2.261-2.115-1.139-5.5-3.394-3.394-7.428,6.948-19.012,9.8-28.967,8.746a27.94,27.94,0,0,1-14.077-5.471A23.6,23.6,0,0,1,39,250.722a51.886,51.886,0,0,1-2.256-13.92A85.168,85.168,0,0,1,37.71,224.1a128.293,128.293,0,0,1,4.175-20.236c4.45-14.488,9.87-28.758,15.491-42.826q.882-2.208,1.792-4.4c.073-.174.357-.851.286-.683s.2-.468.267-.627c.257-.6.516-1.194.782-1.788a10.873,10.873,0,0,0,.559-1.219c.312-1.031-.55.518-.678-.138a6.669,6.669,0,0,0,.959.18q2.284.426,4.574.833c8.54,1.533,17.089,3.018,25.631,4.544.155.028.9.1.923.12,0,0-.166-1.34-.024.29a16.324,16.324,0,0,1-.394,3.115q-.414,3.285-.818,6.57-.912,7.415-1.794,14.832-1.769,14.874-3.4,29.764-.333,3.1-.651,6.2a2.417,2.417,0,0,0,2.4,2.4,2.453,2.453,0,0,0,2.4-2.4Z" /><path fill="#211715" d="M88.146,237.1c2.171,22.379,3.056,44.9,3.772,67.362q.28,8.787.48,17.576a2.439,2.439,0,0,0,2.4,2.4q14.526,0,29.051-.016l37.972-.029,39.748-.033,34.3-.03,21.61-.019h1.455a2.429,2.429,0,0,0,2.4-2.4c-.3-11.314-.763-22.624-1.3-33.929-.552-11.728-1.176-23.455-2.024-35.166-.774-10.679-1.893-21.347-3.168-31.977-1.641-13.69-4.2-27.558-11.139-39.667a51.625,51.625,0,0,0-13.443-15.458,104.267,104.267,0,0,0-16.991-10.18q-2.112-1.059-4.233-2.1a2.462,2.462,0,0,0-3.284.861,2.422,2.422,0,0,0,.861,3.283c11.539,5.691,23.556,11.625,30.879,22.668,7.444,11.223,10.469,24.552,12.193,37.733,2.869,21.943,4.28,44.024,5.363,66.116.617,12.6,1.145,25.2,1.482,37.815l2.4-2.4-19.617.017-33.139.029-39.472.033q-19.287.017-38.574.03-15.222.01-30.445.018H94.8l2.4,2.4c-.511-22.466-1.313-44.943-2.832-67.366-.4-5.863-.852-11.722-1.42-17.572a2.466,2.466,0,0,0-2.4-2.4,2.419,2.419,0,0,0-2.4,2.4Z" /><path fill="#211715" d="M136.511,145.93c-1.292,2.68-3.4,3.9-6.024,5.055-2.98,1.314-6.066,2.4-9.114,3.539-1.35.5-2.372,2.137-1.435,3.526a32.025,32.025,0,0,0,12.871,11.192,45.829,45.829,0,0,0,18.908,3.858,77.089,77.089,0,0,0,33.556-7.352,75.188,75.188,0,0,0,16.808-10.9c1.265-1.078.68-2.958-.486-3.77-3.771-2.626-8.023-4.562-11.489-7.623a11.7,11.7,0,0,1-3.767-5.719c-.969-3.242-1.595-6.609-2.357-9.9-.695-3.008-5.325-1.735-4.628,1.276.81,3.5,1.43,7.127,2.558,10.543a15.97,15.97,0,0,0,4.553,6.977c3.825,3.48,8.5,5.665,12.707,8.6l-.485-3.769a70.932,70.932,0,0,1-28.614,14.665c-10.367,2.616-22.253,3.525-32.487-.076a27.207,27.207,0,0,1-13.5-10.416l-1.434,3.526c3.552-1.329,7.111-2.642,10.585-4.168a14,14,0,0,0,7.421-6.632,2.464,2.464,0,0,0-.861-3.284,2.422,2.422,0,0,0-3.283.861Z" /></svg>

                <span>Headache</span>
              </span>
            </li>
            <li className={`st-tab-title ${isActive === 3 ? "active" : ""}`} onClick={() => setIsActive(3)}>
              <span className="st-dip-blue-box">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                  viewBox="0 0 295.996 295.996" height="35px" width="35px">
                  <g>
                    <path d="M147.998,0C66.392,0,0,66.392,0,147.998s66.392,147.998,147.998,147.998s147.998-66.392,147.998-147.998
		S229.605,0,147.998,0z M147.998,279.996c-36.256,0-69.143-14.696-93.022-38.44c-9.536-9.482-17.631-20.41-23.934-32.42
		C21.442,190.847,16,170.048,16,147.998C16,75.214,75.214,16,147.998,16c34.523,0,65.987,13.328,89.533,35.102
		c12.208,11.288,22.289,24.844,29.558,39.996c8.27,17.239,12.907,36.538,12.907,56.9
		C279.996,220.782,220.782,279.996,147.998,279.996z"/>
                    <polygon points="107.009,147.86 107.102,147.953 136.355,118.698 107.101,89.445 95.788,100.76 113.729,118.698 99.747,132.679 
		95.787,136.639 	"/>
                    <polygon points="196.247,132.679 182.266,118.698 200.206,100.76 188.894,89.445 159.639,118.698 188.893,147.953 188.985,147.86 
		200.207,136.639 	"/>
                    <path d="M213.664,189.333v-0.339c0-2.946-0.347-5.786-1.288-8.43c-3.212-9.034-11.342-15.756-21.22-16.492
		c-0.596-0.045-1.113-0.075-1.72-0.075h-82.877c-0.607,0-1.208,0.03-1.804,0.075c-9.879,0.736-18.258,7.458-21.47,16.492
		c-0.94,2.643-1.621,5.483-1.621,8.43v0.339c0,13.621,11.273,24.664,24.895,24.664h82.877
		C203.057,213.997,213.664,202.954,213.664,189.333z M97.664,189.333v-0.339c0-4.777,4.117-8.997,8.895-8.997h82.438h0.438
		c4.777,0,8.229,4.22,8.229,8.997v0.339c0,4.777-3.451,8.664-8.229,8.664h-82.877C101.781,197.997,97.664,194.11,97.664,189.333z"/>
                  </g>
                </svg>
                <span>Stress Level</span>
              </span>
            </li>
            <li className={`st-tab-title ${isActive === 4 ? "active" : ""}`} onClick={() => setIsActive(4)}>
              <span className="st-orange-box">
                <svg viewBox="-18.44 0 310.65 310.65" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#a98a75" d="M212.537,148.65c9-5.494,8.432-12.086,8.074-16.041a44.13,44.13,0,0,0-4.117-15.214c-2.894-6.6-8.36-20.049-10.642-44.687a119.031,119.031,0,0,0-1.189-15.621c-.316-2.416-.619-4.456-.83-5.791-2.47-15.97-13.662-33.458-26.353-39.365-15.609-9.767-28.794-10.819-41.532-8.5-18.076,3.286-31.79,12.228-40.088,25.06-4.791,7.409-7.6,17.633-8.025,26.473a89.874,89.874,0,0,0,4.482,30.092c4.01,19.047.66,40.026,3.892,55.618,1.013,4.957,4.2,10.694,11.678,14.664Z" /><path fill="#211715" d="M181.651,17.244c8.086,6.059,13.961,15.417,17.327,24.834a71.681,71.681,0,0,1,3.285,15.009c.367,2.809.683,5.627.905,8.452.226,2.867.139,5.759.423,8.615a165.149,165.149,0,0,0,5.476,29.84q1.344,4.615,3.07,9.107c1.125,2.909,2.48,5.726,3.571,8.647a37.5,37.5,0,0,1,2.648,14.547,10.963,10.963,0,0,1-1.3,4.729,15.845,15.845,0,0,1-5.726,5.553c-2.618,1.629-.211,5.783,2.423,4.145,4.232-2.633,7.95-6.38,9.022-11.407.837-3.924.259-8.2-.5-12.078a45.051,45.051,0,0,0-2.573-8.386c-.439-1.075-.906-2.138-1.369-3.2-.1-.237-.2-.474-.306-.711-.043-.1-.085-.2-.127-.3-.159-.372.18.438-.084-.2-1.117-2.7-2.14-5.444-3.045-8.227A147.346,147.346,0,0,1,208.8,77.883c-.7-5.979-.688-11.995-1.385-17.984a93.2,93.2,0,0,0-2.926-16.444c-3.566-11.714-10.541-22.96-20.41-30.356a2.417,2.417,0,0,0-3.284.861,2.459,2.459,0,0,0,.861,3.284Z" /><path fill="#ffffff" d="M184.746,72.784l-6.516-.646C171.816,69.683,164.1,60.805,161,55.489a140.547,140.547,0,0,1-7.266-14.523c-7.167,9.99-18.529,18.265-31.143,23.543a2.065,2.065,0,0,1-2.872-1.8,32.747,32.747,0,0,1,.6-7.989.457.457,0,0,0-.777-.408C111.9,62.3,103.615,70.65,95.78,77.554c-.856.759-1.9,1.584-2.555,2.154l-1.577,1.368.1.388c1.91,7.516,3.484,15.079,5.087,22.017q.178.773.369,1.535c2.848,11.395,7.832,21.34,16.8,27.066,7.4,4.725,14.822,6.961,22.882,6.763.526,3.407-2.864,5.831-5.612,7.223-3.022,1.866-8.214,4.424-12.324,6.576,4.177,5.1,9.934,8.012,16.063,9.608a48.555,48.555,0,0,0,18.75.83c17.226-2.278,34.321-10.2,44.975-24.858-5.906-1.321-15.106-1.521-17.73-5.985a26.968,26.968,0,0,1-2.169-5.277l-2.293-6.937a67.283,67.283,0,0,0,7.815-12.108s1.8-3.659,2.5-5.711c0,0,.181-.531.383-1.111a15,15,0,0,0,7.1-2.555,20.393,20.393,0,0,0,6.593-9.919c1.436-4.02,1.525-10.5-.6-14.028-.713-1.179-2.376-3.188-6.276-3.317a7.794,7.794,0,0,0-5.445,1.891Z" /><path fill="#211715" d="M89.216,82.311C92.108,93.5,92.1,105.122,92.172,116.6c.036,5.336.068,10.684.517,16.005.381,4.507.882,9.138,2.737,13.307a25.078,25.078,0,0,0,11.249,11.5c2.718,1.469,5.144-2.674,2.423-4.144a20.946,20.946,0,0,1-9.274-9.228c-1.656-3.445-2.034-7.777-2.351-11.628-.889-10.781-.251-21.626-.884-32.42a98.677,98.677,0,0,0-2.745-18.952c-.772-2.988-5.4-1.721-4.628,1.276Z" /><path fill="#211715" d="M131.328,119.328a9.9,9.9,0,0,1,1.291-.772c.112-.057.225-.111.34-.164.049-.023.434-.183.155-.072-.316.127.261-.095.262-.1.126-.046.252-.091.379-.134a16.925,16.925,0,0,1,1.682-.473q.408-.093.819-.166c.137-.024.275-.042.412-.068.377-.071-.575.056.083-.01.541-.054,1.082-.094,1.626-.1.293,0,.587.005.88.023.127.008.253.018.379.03.067.006.479.07.143.012-.376-.065.194.04.216.045.129.026.258.054.385.086.3.074.594.165.888.259.705.227,1.4.482,2.111.7a2.425,2.425,0,0,0,2.953-1.677,2.449,2.449,0,0,0-1.677-2.952,27.4,27.4,0,0,0-4.237-1.173,15.168,15.168,0,0,0-3.873-.028,16.65,16.65,0,0,0-7.64,2.587,2.452,2.452,0,0,0-.861,3.283,2.428,2.428,0,0,0,3.284.861Z" /><path fill="#211715" d="M142.345,87.822c-.967-2.409-.944-8.138,3.7-9.011,6.194-.477,7.095,6.372,5.28,9.778C149.839,91.378,144.913,92.9,142.345,87.822Z" /><path fill="#211715" d="M105.685,92.03c-.91-2.424-.945-8.164,3.3-8.993,5.674-.417,6.568,6.455,4.938,9.851C112.592,95.668,108.09,97.14,105.685,92.03Z" /><path fill="#211715" d="M125.573,95.306c-.724,1.625-1.418,3.274-2,4.957a4.741,4.741,0,0,0-.32,1.807,3.405,3.405,0,0,0,.449,1.605,4.014,4.014,0,0,0,1.232,1.2,4.792,4.792,0,0,0,2.276.763c.322.034.64,0,.962.014a2.42,2.42,0,0,0,2.4-2.4,2.448,2.448,0,0,0-2.4-2.4c-.322-.009-.641.024-.962-.014l.638.085a2.5,2.5,0,0,1-.589-.164l.573.241a3.363,3.363,0,0,1-.577-.343l.486.375a1.486,1.486,0,0,1-.223-.2l.375.486a.688.688,0,0,1-.085-.14l.242.573a1.223,1.223,0,0,1-.072-.237l.085.638a1.816,1.816,0,0,1,0-.442l-.086.638a9.84,9.84,0,0,1,.628-1.934c.269-.7.554-1.4.846-2.091l-.242.573c.166-.391.333-.782.506-1.17a2.611,2.611,0,0,0,.242-1.849,2.449,2.449,0,0,0-1.1-1.434,2.42,2.42,0,0,0-1.85-.242,2.326,2.326,0,0,0-1.434,1.1Z" /><path fill="#211715" d="M175.473,124.883a64.339,64.339,0,0,0,13.7-22.039,2.4,2.4,0,1,0-4.629-1.276,53.153,53.153,0,0,1-4.006,8.362,61.908,61.908,0,0,1-8.464,11.559c-2.1,2.259,1.285,5.661,3.4,3.394Z" /><path fill="#211715" d="M173.88,7.079A57.684,57.684,0,0,0,143.454.1a71.111,71.111,0,0,0-27.891,7.619,57.269,57.269,0,0,0-19.929,16.89c-6,8.132-9.151,18.182-10.048,28.184a71.65,71.65,0,0,0,.576,15.773A90.966,90.966,0,0,0,90.135,86.08c.995,2.906,5.633,1.658,4.629-1.276C88.8,67.371,87.516,46.191,97.722,30.028c9.12-14.443,25.5-22.763,42.148-24.8a51.718,51.718,0,0,1,14.985.208,56.247,56.247,0,0,1,16.6,5.785c2.733,1.434,5.162-2.707,2.423-4.144Z" /><path fill="#211715" d="M163.136,127.7a59.135,59.135,0,0,1-19.181,7.949,37.608,37.608,0,0,1-20.193-1.331,35.112,35.112,0,0,1-15.579-10.721c-3.894-4.829-6.31-10.778-7.993-16.692-2.441-8.578-3.941-17.429-6.13-26.076C93.3,77.833,88.672,79.1,89.432,82.1c2.061,8.142,3.574,16.424,5.71,24.545,1.723,6.547,4.256,13.089,8.288,18.578,8.716,11.865,24.061,17.539,38.472,15.6,8.508-1.146,16.369-4.529,23.656-8.98,2.633-1.608.224-5.761-2.422-4.145Z" /><path fill="#211715" d="M190.316,74.864a5.474,5.474,0,0,1,3.748-1.188,6.374,6.374,0,0,1,2.12.4,4.4,4.4,0,0,1,.656.321,3.908,3.908,0,0,1,.463.3c.178.147.329.319.5.475.077.072.144.159.213.238-.3-.338-.082-.118-.02-.027a7.135,7.135,0,0,1,.711,1.249,12.653,12.653,0,0,1,.853,4.226c.288,5.606-1.911,12.258-6.57,15.723-2.287,1.7-5.788,2.7-8.541,1.8-2.943-.962-4.2,3.671-1.276,4.629,3.8,1.241,8.343.112,11.681-1.919,3.461-2.108,5.9-5.717,7.455-9.383a24.282,24.282,0,0,0,2.029-11.224c-.239-3.423-1.136-7.16-3.924-9.417a10.746,10.746,0,0,0-13.489.4,2.421,2.421,0,0,0,0,3.394,2.449,2.449,0,0,0,3.394,0Z" /><path fill="#211715" d="M151.785,42.468c2.738,6.4,5.831,12.98,10.085,18.526,4.138,5.4,9.275,10.907,15.722,13.459a2.417,2.417,0,0,0,2.952-1.677,2.457,2.457,0,0,0-1.676-2.952A24.209,24.209,0,0,1,171.82,64.9a52.3,52.3,0,0,1-6.418-7.137c-3.952-5.337-6.871-11.637-9.472-17.715a2.414,2.414,0,0,0-3.284-.861,2.463,2.463,0,0,0-.861,3.283Z" /><path fill="#211715" d="M151.651,39.772c-6.407,8.854-15.556,15.57-25.275,20.386q-1.892.938-3.828,1.781a4.277,4.277,0,0,0-.593.256c-.475.33-.332-.165.066.162.013.011,0,.033.02.042q.144.706.064-.169-.009-.36-.011-.72a30.943,30.943,0,0,1,.244-4.482c.234-1.7.887-3.715-.947-4.811-1.641-.981-3.037-.128-4.192,1.076q-1.633,1.7-3.277,3.4-3.488,3.59-7.039,7.117c-4.96,4.916-10.048,9.668-15.355,14.2a2.42,2.42,0,0,0,0,3.394,2.449,2.449,0,0,0,3.394,0q6.786-5.8,13.154-12.039,3.324-3.246,6.578-6.56,1.668-1.695,3.323-3.4.739-.764,1.477-1.529a10.778,10.778,0,0,1,1.513-1.614l-1.212.327h.226l-1.211-.327.2.1-.861-.861.127.187-.327-1.211a17.51,17.51,0,0,1-.4,2.784,32.993,32.993,0,0,0-.214,3.3c-.033,1.992-.061,4,1.564,5.414,1.69,1.468,3.637,1.173,5.527.365q2.62-1.122,5.164-2.411A79.367,79.367,0,0,0,147.8,51.276a62.7,62.7,0,0,0,8-9.081,2.42,2.42,0,0,0-.861-3.284,2.454,2.454,0,0,0-3.284.861Z" /><path fill="#211715" d="M174.35,121.02c1.144,3.463,2.136,7.03,3.577,10.384a10.387,10.387,0,0,0,5.112,5.636c4.655,2.249,9.94,2.4,14.918,3.467a2.456,2.456,0,0,0,2.952-1.676,2.425,2.425,0,0,0-1.676-2.953c-4.406-.945-9.437-1.109-13.469-2.84-.228-.1-.832-.405-1.179-.613a3.207,3.207,0,0,1-.832-.6c-.157-.16-.319-.313-.467-.482-.109-.129-.1-.111.033.052-.064-.089-.125-.181-.181-.275a17,17,0,0,1-.942-1.855c-1.284-3.077-2.172-6.36-3.218-9.523-.965-2.919-5.6-1.669-4.628,1.276Z" /><path fill="#211715" d="M134.485,138.839c.215,1.728-.774,2.876-2.371,3.959-1.679,1.138-3.535,2.1-5.318,3.061-4.039,2.185-8.2,4.153-12.2,6.409-2.691,1.517-.274,5.666,2.423,4.145,4.339-2.448,8.863-4.552,13.219-6.97,3.991-2.216,9.723-5.13,9.043-10.6a2.475,2.475,0,0,0-2.4-2.4,2.415,2.415,0,0,0-2.4,2.4Z" /><path fill="#211715" d="M146.515,72.119a12.276,12.276,0,0,0,7.205,2.233,2.5,2.5,0,0,0,1.7-.7,2.4,2.4,0,0,0-1.7-4.1,9.566,9.566,0,0,1-1.385-.073l.638.086a10.527,10.527,0,0,1-2.631-.713l.573.242a9.818,9.818,0,0,1-1.978-1.12,2.413,2.413,0,0,0-1.849-.241,2.4,2.4,0,0,0-1.676,2.952l.242.573a2.4,2.4,0,0,0,.861.861Z" /><path fill="#211715" d="M162.888,83.119a56.275,56.275,0,0,0,.525,6.664c.28,1.946.586,4.206,1.969,5.716a5.888,5.888,0,0,0,5.933,1.415,6.333,6.333,0,0,0,4.147-4.569,2.4,2.4,0,1,0-4.628-1.276c-.044.152-.094.3-.141.451-.157.505.255-.454,0,.008-.074.136-.157.272-.227.41-.19.375.243-.241.053-.046-.109.112-.222.223-.329.337-.172.181.412-.216.032-.04a2.982,2.982,0,0,1-.3.158l.265-.114a3.54,3.54,0,0,0-.469.136c-.5.139.51.01-.013,0l-.494,0c-.443,0,.338.1.071,0-.1-.036-.611-.089-.251-.05.319.034-.025-.037-.143-.092-.445-.208.319.291-.017-.018s.213.422.006-.011q-.063-.108-.117-.222c-.076-.16-.053-.1.07.178a2.57,2.57,0,0,1-.282-.905c-.087-.342-.157-.688-.225-1.034q-.125-.64-.224-1.285c-.009-.057-.108-.767-.036-.215-.028-.212-.053-.425-.077-.638-.186-1.648-.263-3.305-.3-4.962a2.4,2.4,0,1,0-4.8,0Z" /><path fill="#f8b8b4" d="M144.364,163.583a56.338,56.338,0,0,0,9.4-.5c17.545-2.32,34.954-10.5,45.559-25.673,12.282.971,30.292,8.677,38.174,16.379,15.928,15.563,22.5,37.106,27.33,57.39,4.993,20.979,9.08,46.729,4.57,60.616-2.1,6.475-5.367,10.516-11.733,15.4-9.043,6.937-28.572,12.211-43.371,12.543a145.943,145.943,0,0,0-4.651-21.517c-24.423,5.553-75.158,17.084-75.158,17.084l-10.928,8.42c-4.492,4.034-16.04,5.6-23.834,3.667-5.993-1.487-10.764-3.315-16.225-10.175-6.511-8.179-8.041-23.1-6.233-38.867,2.776-24.215,2.85-38.554,5.439-62.952,1.276-8.64,3.183-14.149,8.767-22.05,6.952-9.836,14.35-14,26.86-21.492,4.217,5.595,10.246,8.72,16.684,10.4A43.531,43.531,0,0,0,144.364,163.583Z" /><path fill="#ffffff" d="M130.422,294.35s.029-1.423.055-2.843a7.438,7.438,0,0,1-1.425-1.278,4.628,4.628,0,0,1-.184-5.236l1.425-2.012a6.735,6.735,0,0,1-1.472-1.02,3.973,3.973,0,0,1-.683-4.85,3.781,3.781,0,0,1,3.392-1.925c1.909-.07,5.638.135,10.771,0,4.935-.13,9.639-.833,16.028-1.516l.159-.16-3.624-1.118a28.11,28.11,0,0,1-6.2-2.178,4.481,4.481,0,0,1-1.947-2.035,2.59,2.59,0,0,1-.117-.342l-2.05-.076c-10.758.109-26.49-.611-35.921-3.6a5.11,5.11,0,0,0-.875,1.485,55.575,55.575,0,0,0-2.135,27.316l3,1.815a21.923,21.923,0,0,0,21.427.866l.448-.248A5.971,5.971,0,0,1,130.422,294.35Z" /><path fill="#ffffff" d="M197.067,294.919c-4.84,1.6-11.183,6.318-15.814,8.119a29.459,29.459,0,0,1-7.854,2.211c-2.2.275-19.536.52-24.277.707a7.785,7.785,0,0,1-5.951-2.079l-.37-1.649c-1.515-.112-2.883-.253-4.007-.432-2.506-.4-5.222-.841-6.969-2.889a7.945,7.945,0,0,1-1.4-4.557s.029-1.423.055-2.843a7.438,7.438,0,0,1-1.425-1.278,4.628,4.628,0,0,1-.184-5.236l1.425-2.012a6.735,6.735,0,0,1-1.472-1.02,3.973,3.973,0,0,1-.683-4.85,3.781,3.781,0,0,1,3.392-1.925c1.909-.07,5.638.135,10.771,0,5.067-.134,9.875-.871,16.529-1.571l-3.966-1.223a28.11,28.11,0,0,1-6.2-2.178,4.481,4.481,0,0,1-1.947-2.035,4.613,4.613,0,0,1,1.023-4.752,8.647,8.647,0,0,1,4.235-1.3c8.459-.341,15.752.935,24.156,2.464a54,54,0,0,0,12.76.869,89.482,89.482,0,0,0,12.716-4.268l1.353-.632c3.372,6.45,7.228,17.952,9.646,29.4l-2.485.726c-5.17,1.716-11.451,3.751-12.672,4.114Q197.258,294.855,197.067,294.919Z" /><path fill="#211715" d="M212.961,196.455a152.939,152.939,0,0,1,7.83,21.357c2.3,7.655,4.668,15.3,6.508,23.087.71,3,5.34,1.732,4.628-1.276-1.869-7.905-4.277-15.67-6.615-23.445a158.462,158.462,0,0,0-8.206-22.146,2.421,2.421,0,0,0-3.284-.861,2.454,2.454,0,0,0-.861,3.284Z" /><path fill="#211715" d="M197.9,139.719c6.857.288,13.678,2.461,19.991,5.029,6.1,2.482,12.416,5.668,17.3,10.161,11.6,10.666,18.369,25.719,22.934,40.523,2.321,7.524,4.2,15.194,5.868,22.886a233.884,233.884,0,0,1,4.175,24.8c.77,7.224,1.248,14.681.275,21.911a27.547,27.547,0,0,1-8.054,16.721A46.862,46.862,0,0,1,243,291.889a98.292,98.292,0,0,1-22.514,5.053q-2.8.283-5.605.38c-3.08.1-3.094,4.9,0,4.8a100.641,100.641,0,0,0,24.2-3.955c6.813-1.953,13.964-4.5,19.675-8.817a42.672,42.672,0,0,0,8.639-8.314A29.455,29.455,0,0,0,272,271.491c1.965-6.839,1.963-14.261,1.558-21.306-.98-17.034-4.636-34.084-9.186-50.495-4.436-16-10.813-31.83-22.04-44.328a55.433,55.433,0,0,0-17.562-12.769,77.931,77.931,0,0,0-21.71-7.136,46.789,46.789,0,0,0-5.162-.538c-3.088-.13-3.082,4.67,0,4.8Z" /><path fill="#211715" d="M119.04,148.629c-5.931,3.567-12.04,6.954-17.578,11.126a56.9,56.9,0,0,0-13.1,13.882,48.469,48.469,0,0,0-7.684,19.288c-.7,4.136-.984,8.354-1.36,12.529q-.52,5.791-.949,11.592c-.535,7.13-1,14.266-1.576,21.394-.652,8.093-1.73,16.154-2.342,24.247a76.657,76.657,0,0,0,1.3,22.934,32.854,32.854,0,0,0,9.684,17.244,31,31,0,0,0,17.274,7.478c6.337.8,13.43.088,19.225-2.719a14.873,14.873,0,0,0,3.315-2.2c2.332-2.034-1.074-5.417-3.394-3.394a11.97,11.97,0,0,1-2.748,1.642,22.627,22.627,0,0,1-3.737,1.2,35,35,0,0,1-9.089.933c-5.474-.125-11.355-1.652-15.8-4.949-10.908-8.089-12.025-22.984-11.4-35.466.39-7.834,1.553-15.638,2.222-23.454.59-6.894,1.06-13.8,1.558-20.7.535-7.411,1.127-14.817,1.868-22.21.656-6.555,1.958-12.923,5.172-18.739a52.394,52.394,0,0,1,11.575-14.442c4.595-3.952,9.893-7.032,15.075-10.135q2.457-1.47,4.912-2.941c2.645-1.591.234-5.743-2.422-4.145Z" /><path fill="#211715" d="M216.674,299.6a145.019,145.019,0,0,0-7.83-31.433c-.806-2.162-1.676-4.3-2.637-6.4-.373-.812-.761-1.617-1.175-2.409a15.738,15.738,0,0,1-1.255-2.2c.005.014-.389.106,0-.229-.009.008.618-.124.7-.153,1.528-.515,3.041-1.08,4.557-1.628q3.916-1.415,7.812-2.884c6.145-2.326,12.234-4.791,18.3-7.318a2.48,2.48,0,0,0,1.677-2.952,2.416,2.416,0,0,0-2.953-1.676c-5.681,2.367-11.384,4.683-17.136,6.875q-4.058,1.548-8.141,3.025-2.135.774-4.274,1.534c-1.436.51-3.047.883-4.118,2.041a4.841,4.841,0,0,0-1.246,3.685,8.144,8.144,0,0,0,1.382,3.3,50.536,50.536,0,0,1,2.485,5.146,123.612,123.612,0,0,1,5,14.692,137.857,137.857,0,0,1,4.045,18.989,2.48,2.48,0,0,0,2.4,2.4c1.164,0,2.573-1.106,2.4-2.4Z" /><path fill="#211715" d="M98.855,202.6c-2.628,15.694,3.3,31.381,11.374,44.594a94.9,94.9,0,0,1,5.937,10.965,2.416,2.416,0,0,0,3.283.861,2.458,2.458,0,0,0,.861-3.283c-3.624-8.179-9.206-15.27-12.518-23.606-3.535-8.9-5.915-18.661-4.308-28.255a2.473,2.473,0,0,0-1.677-2.953,2.419,2.419,0,0,0-2.952,1.677Z" /><path fill="#211715" d="M110.168,267.1a100.4,100.4,0,0,0,17.143,2.519c5.732.436,11.487.593,17.235.54,3.087-.029,3.095-4.829,0-4.8-10.979.1-22.408-.165-33.1-2.888-2.994-.762-4.272,3.866-1.276,4.629Z" /><path fill="#211715" d="M107.4,296.846a24.434,24.434,0,0,0,23.85.865c2.746-1.418.321-5.561-2.422-4.145a19.513,19.513,0,0,1-19-.865c-2.626-1.644-5.038,2.508-2.423,4.145Z" /><path fill="#211715" d="M117,154.023c8.58,10.657,23.664,13.134,36.527,11.49,11.71-1.5,23.255-5.375,32.994-12.15a60.227,60.227,0,0,0,14.553-14.283,2.418,2.418,0,0,0-.861-3.283,2.453,2.453,0,0,0-3.284.861,57.619,57.619,0,0,1-25.64,19.443c-10.934,4.327-23.811,6.815-35.392,3.9-6.048-1.523-11.55-4.459-15.5-9.369a2.416,2.416,0,0,0-3.394,0,2.456,2.456,0,0,0,0,3.394Z" /><path fill="#211715" d="M112.391,261.655c-1.651-.828-3.483-1.032-4.958.279a9.82,9.82,0,0,0-2.522,4.616,54.2,54.2,0,0,0-2.123,10.329,57.629,57.629,0,0,0,1.372,20.72c.766,2.99,5.4,1.723,4.629-1.276a53.158,53.158,0,0,1-1.464-16.433,50.773,50.773,0,0,1,1.13-8.048c.3-1.353.663-2.695,1.085-4.016a10.3,10.3,0,0,1,.579-1.629c.016-.032.415-.6.425-.592a2.066,2.066,0,0,0-.576.195c2.754,1.38,5.188-2.759,2.423-4.145Z" /><path fill="#211715" d="M155.5,270.077c-1.883-.5-4.318-.928-5.93-2.1a1.417,1.417,0,0,1-.734-1.449,2.8,2.8,0,0,1,.2-.89c.026-.064.454-.532.2-.333a5.367,5.367,0,0,1,2.73-.777,41.115,41.115,0,0,1,4.3-.039,81.977,81.977,0,0,1,8.253.624c5.338.659,10.584,1.914,15.93,2.5,3.734.409,7.563.688,11.2-.373a80.84,80.84,0,0,0,11.157-3.976,2.421,2.421,0,0,0,.861-3.284,2.457,2.457,0,0,0-3.284-.861c-.6.276-1.023.444-1.906.779-.946.359-1.9.7-2.856,1.028-1.809.624-3.63,1.221-5.47,1.75-.508.146-1.041.245-1.544.406-.271.087-.483-.06.271-.022a6.815,6.815,0,0,0-.717.052c-.7.041-1.408.054-2.113.05a53.494,53.494,0,0,1-7.791-.636c-6.1-.939-12.121-2.22-18.293-2.663a45.336,45.336,0,0,0-9.022-.03c-2.467.324-5.1,1.259-6.193,3.671a6.667,6.667,0,0,0,1.345,7.818c2.066,1.937,5.455,2.678,8.123,3.382,2.99.789,4.265-3.84,1.276-4.629Z" /><path fill="#211715" d="M159.458,271.15c-5.11.53-10.209,1.289-15.342,1.563-2.62.139-5.249.136-7.872.1a35.454,35.454,0,0,0-5.729.08c-5.411.826-7.062,7.861-2.847,11.208,2.167,1.72,4.69,2.176,7.376,2.4q3.85.323,7.714.441c6.345.194,12.691-.04,19.022-.47a2.457,2.457,0,0,0,2.4-2.4,2.421,2.421,0,0,0-2.4-2.4c-4.954.336-9.916.558-14.882.54a96,96,0,0,1-13.2-.631c-1.321-.19-3.835-.876-3.689-2.617.105-1.253,1.12-1.388,2.237-1.4,4.019-.033,8.032.155,12.05-.069,5.072-.284,10.111-1.029,15.161-1.553a2.469,2.469,0,0,0,2.4-2.4,2.415,2.415,0,0,0-2.4-2.4Z" /><path fill="#211715" d="M126.8,283.781a7.218,7.218,0,0,0,2.925,10.081,14.107,14.107,0,0,0,5.307,1.345c1.678.222,3.362.4,5.048.543a213.99,213.99,0,0,0,22.494.632c3.085-.062,3.095-4.862,0-4.8-6.451.129-12.916.02-19.356-.4-2.849-.185-5.708-.411-8.533-.831a5.692,5.692,0,0,1-3.506-1.373,2.179,2.179,0,0,1-.234-2.777c1.59-2.657-2.558-5.074-4.145-2.423Z" /><path fill="#211715" d="M128.022,294.35a8.912,8.912,0,0,0,5.279,8.5c2.8,1.224,6.031,1.5,9.054,1.744,6.13.489,12.3.461,18.447.461,3.089,0,3.094-4.8,0-4.8-5.48,0-10.969,0-16.441-.324a42.759,42.759,0,0,1-7.1-.838,6.29,6.29,0,0,1-3.482-1.6,4.922,4.922,0,0,1-.956-3.142c.018-3.09-4.782-3.093-4.8,0Z" /><path fill="#211715" d="M141.474,305.574c3.494,3.523,8.571,2.737,13.066,2.633,4.387-.1,8.774-.185,13.161-.309,3.639-.1,7.189-.176,10.7-1.282,5.85-1.842,10.758-5.249,16.166-8.012a41.958,41.958,0,0,1,6.391-2.4q4.906-1.579,9.795-3.2c2.918-.968,1.668-5.605-1.276-4.629s-5.894,1.944-8.847,2.9c-1.775.574-3.6,1.062-5.336,1.755-5.154,2.061-9.56,5.6-14.681,7.7a27.821,27.821,0,0,1-7.358,2.141c-1.2.133-2.424.136-3.629.176-4.1.136-8.2.214-12.3.3-2.109.047-4.219.092-6.328.152-2.134.06-4.482.343-6.127-1.316-2.178-2.2-5.572,1.2-3.394,3.394Z" /><path class="e" d="M53.167,243.57c-8.2-2.458-16.309-5.232-24.518-7.672a2.431,2.431,0,0,0-3.038,2.314c-.324,4.092-.28,8.2-.52,12.3l3.038-2.314c-8.41-2.853-16.793-5.785-25.2-8.646-2.93-1-4.188,3.637-1.276,4.628,8.407,2.861,16.79,5.794,25.2,8.647a2.426,2.426,0,0,0,3.038-2.315c.24-4.1.2-8.209.52-12.3l-3.038,2.314c8.209,2.44,16.314,5.214,24.518,7.673,2.965.888,4.232-3.743,1.276-4.629Z" /><path class="e" d="M64.365,231.337c-7.8-7.729-14.556-16.448-22.368-24.159a2.432,2.432,0,0,0-3.77.486c-2.208,3.461-4.1,7.112-6.236,10.616l3.769-.486c-6.562-6.962-13.411-13.648-19.966-20.617-2.121-2.255-5.51,1.144-3.394,3.394,6.555,6.969,13.4,13.655,19.966,20.618a2.425,2.425,0,0,0,3.769-.486c2.137-3.5,4.029-7.155,6.237-10.616l-3.77.485c7.813,7.711,14.573,16.43,22.369,24.159,2.2,2.177,5.591-1.215,3.394-3.394Z" /></svg>

                <span>Stomach</span>
              </span>
            </li>
            <li className={`st-tab-title ${isActive === 5 ? "active" : ""}`} onClick={() => setIsActive(5)}>
              <span className="st-gray-box">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                  viewBox="0 0 512 512" height="35px">
                  <g>
                    <g>
                      <path d="M210.16,276.71c-0.211,0.105-21.58,10.51-41.574,10.51c-20.07,0-41.4-10.425-41.613-10.53l-16.715,33.527
			c1.181,0.592,29.265,14.466,58.328,14.466s57.147-13.874,58.328-14.466L210.16,276.71z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M384.989,276.71c-0.21,0.105-21.58,10.51-41.574,10.51c-20.07,0-41.4-10.425-41.613-10.53l-16.715,33.527
			c1.181,0.592,29.265,14.466,58.328,14.466c29.063,0,57.147-13.874,58.328-14.466L384.989,276.71z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M256,374.634c-13.772,0-24.976,11.204-24.976,24.976c0,13.772,11.204,24.976,24.976,24.976
			c13.767,0,24.971-11.202,24.976-24.976C280.976,385.838,269.774,374.634,256,374.634z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <polygon points="287.976,144.369 274.732,112.393 193.561,112.393 193.561,149.856 229.51,149.856 186.56,192.805 
			199.805,224.783 280.976,224.783 280.976,187.32 245.027,187.32 		"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <polygon points="394.123,119.391 380.878,87.415 299.707,87.415 299.707,124.878 335.656,124.878 292.707,167.829 
			305.951,199.805 387.122,199.805 387.122,162.341 351.173,162.341 		"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <polygon points="500.269,94.415 487.024,62.439 405.854,62.439 405.854,99.902 441.802,99.902 398.853,142.853 412.098,174.829 
			493.268,174.829 493.268,137.366 457.32,137.366 		"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M508.251,212.293h-38.109c2.878,14.128,4.394,28.744,4.394,43.707c0,120.501-98.036,218.537-218.537,218.537
			S37.463,376.501,37.463,256S135.499,37.463,256,37.463c25.519,0,50.025,4.412,72.811,12.488h39.579v-23.92
			C334.442,9.372,296.297,0,256,0C114.84,0,0,114.842,0,256s114.84,256,256,256s256-114.842,256-256
			C512,241.101,510.706,226.5,508.251,212.293z"/>
                    </g>
                  </g>
                </svg>
                <span>Sleep Cycle(Hrs)</span>
              </span>
            </li>
          </ul>


          <div className="st-height-b25 st-height-lg-b25" />
          <div className="tab-content">
            <div id="Crutches" className={`st-tab ${isActive === 0 ? "active" : ""}`}>
              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!<br /></h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>

                <div className="tracker-container20">
                  <div className="track-section20">
                    <h2>Track Your Weight</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory}>
                        History
                      </button>
                    </div>
                  </div>
                </div>

                {showForm && (
                  <div className="weightinp-section20">
                    <div className="weightinp-group20">
                      <div className="weightinp-field20">
                        <img
                          src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                          alt="Calendar"
                          className="image-icon20"
                        />
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="weightinp-field20">
                        <img
                          src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2076.png"
                          alt="Note"
                          className="image-icon20"
                        />
                        <input
                          type="number"
                          placeholder="KG"
                          value={newWeight}
                          onChange={(e) => setNewWeight(e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="sav-btn20" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                )}

                {showHistory && historyData.length > 0 && (
                  <div className="history-section20">
                    <table className="history-table20">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{entry.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Weight Display Section - Shown only if weight has been set */}
                {weight && (
                  <div className="weight-display20">
                    <h3>Last Checked {lastChecked}</h3>
                    <div className="circl20">
                      <span>{weight} Kg</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="X-ray" className={`st-tab ${isActive === 1 ? "active" : ""}`}>

              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!</h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>

                <div className="hortracker-container20">
                  <div className="hortrack-section20">
                    <h2>Track Your Hormones</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew1}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory1}>
                        History
                      </button>
                    </div>
                  </div>

                  {/* Input Section - Shown only when Add New is clicked */}
                  {showForm1 && (
                    <div className="hormonesinp-section20">
                      <div className="hormonesinp-group20">
                        <div className="hormonesinp-field20">
                          <img
                            src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                            alt="Calendar"
                            className="image-icon20"
                          />
                          <input
                            type="date"
                            value={date1}
                            onChange={(e) => setDate1(e.target.value)}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="fsh">FSH Level</label>
                          <input
                            type="text"
                            name="FSH"
                            value={hormones.FSH}
                            onChange={handleHormoneChange}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="lh">LH Level</label>
                          <input
                            type="text"
                            name="LH"
                            value={hormones.LH}
                            onChange={handleHormoneChange}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="testosterone">Testosterone Level</label>
                          <input
                            type="text"
                            name="testosterone"
                            value={hormones.testosterone}
                            onChange={handleHormoneChange}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="thyroid">Thyroid Level</label>
                          <input
                            type="text"
                            name="thyroid"
                            value={hormones.thyroid}
                            onChange={handleHormoneChange}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="prolactin">Prolactin Level</label>
                          <input
                            type="text"
                            name="prolactin"
                            value={hormones.prolactin}
                            onChange={handleHormoneChange}
                          />
                        </div>

                        <div className="hormonesinp-field20">
                          <label htmlFor="avgBloodGlucose">Avg Glucose Level</label>
                          <input
                            type="text"
                            name="avgBloodGlucose"
                            value={hormones.avgBloodGlucose}
                            onChange={handleHormoneChange}
                          />
                        </div>
                      </div>

                      <button className="sav-btn20" onClick={handleSave1}>
                        Save
                      </button>
                    </div>
                  )}

                  {/* History Section - Shown when History is clicked */}
                  {showHistory1 && historyData1.length > 0 && (
                    <div className="hormoneshist-section20">
                      <table className="hormoneshist-table20">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>FSH</th>
                            <th>LH</th>
                            <th>Testosterone</th>
                            <th>Thyroid</th>
                            <th>Prolactin</th>
                            <th>Avg Blood Glucose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData1.map((entry, index) => (
                            <tr key={index}>
                              <td>{entry.date1}</td>
                              <td>{entry.FSH}</td>
                              <td>{entry.LH}</td>
                              <td>{entry.testosterone}</td>
                              <td>{entry.thyroid}</td>
                              <td>{entry.prolactin}</td>
                              <td>{entry.avgBloodGlucose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Last Checked Display Section */}
                  {lastChecked1 && (
                    <div className="hormone-display20">
                      <h3>Last Checked {lastChecked1.date1}</h3>
                      <p>FSH: {lastChecked1.FSH}</p>
                      <p>LH: {lastChecked1.LH}</p>
                      <p>Testosterone: {lastChecked1.testosterone}</p>
                      <p>Thyroid: {lastChecked1.thyroid}</p>
                      <p>Prolactin: {lastChecked1.prolactin}</p>
                      <p>Avg Blood Glucose: {lastChecked1.avgBloodGlucose}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div id="Pulmonary" className={`st-tab ${isActive === 2 ? "active" : ""}`}>
              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!</h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>
                <div className="headachetracker-container20">
                  <div className="headachetrack-section20">
                    <h2>Track Your Headache</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew2}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory2}>
                        History
                      </button>
                    </div>
                  </div>
                </div>

                {showForm2 && (
                  <div className="headacheinp-section20">
                    <div className="headacheinp-group20">
                      <div className="headacheinp-field20">
                        <img
                          src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                          alt="Calendar"
                          className="image-icon20"
                        />
                        <input
                          type="date"
                          value={date2}
                          onChange={(e) => setDate2(e.target.value)}
                        />
                      </div>

                      <div className="headache-options">
                        {["Mild","Moderate", "Severe"].map((level) => (
                          <div
                            key={level}
                            className={`headache-option ${severity2 === level ? "selected" : ""
                              }`}
                            onClick={() => handleSeverityChange2(level)}
                          >
                            {level}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="sav-btn20" onClick={handleSave2}>
                      Save
                    </button>
                  </div>
                )}

                {showHistory2 && historyData2.length > 0 && (
                  <div className="headachehis-section20">
                    <table className="headachehis-table20">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData2.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry.date2}</td>
                            <td>{entry.severity2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {lastChecked2 && (
                  <div className="headache-display20">
                    <h3>Last Checked {lastChecked2.date2}</h3>
                    <div className="circle21">
                      <span>{lastChecked2.severity2}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
            <div id="Cardiology" className={`st-tab ${isActive === 3 ? "active" : ""}`}>
              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!</h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>
                <div className="stresstracker-container20">
                  <div className="stresstrack-section20">
                    <h2>Track Your Stress Level</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew3}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory3}>
                        History
                      </button>
                    </div>
                  </div>

                  {showForm3 && (
                    <div className="stressinp-section20">
                      <div className="stressinp-group20">
                        <div className="stressinp-field20">
                          <img
                            src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                            alt="Calendar"
                            className="image-icon20"
                          />
                          <input
                            type="date"
                            value={date3}
                            onChange={(e) => setDate3(e.target.value)}
                          />
                        </div>

                        <div className="stress-options">
                          {["Mild","Moderate", "Severe"].map((level) => (
                            <div
                              key={level}
                              className={`stress-option ${severity3 === level ? "selected" : ""
                                }`}
                              onClick={() => handleSeverityChange3(level)}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="sav-btn20" onClick={handleSave3}>
                        Save
                      </button>
                    </div>
                  )}

                  {showHistory3 && historyData3.length > 0 && (
                    <div className="stresshis-section20">
                      <table className="stresshis-table20">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData3.map((entry, index) => (
                            <tr key={index}>
                              <td>{entry.date3}</td>
                              <td>{entry.severity3}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {lastChecked3 && (
                    <div className="stress-display20">
                      <h3>Last Checked {lastChecked3.date3}</h3>
                      <div className="circle21">
                        <span>{lastChecked3.severity3}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            <div id="DentalCare" className={`st-tab ${isActive === 4 ? "active" : ""}`}>
              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!</h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>
                <div className="stomachtracker-container20">
                  <div className="stomachtrack-section20">
                    <h2>Track Your Stomach</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew4}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory4}>
                        History
                      </button>
                    </div>
                  </div>
                  {showForm4 && (
                    <div className="stomachinp-section20">
                      <div className="stomachinp-group20">
                        <div className="stomachinp-field20">
                          <img
                            src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                            alt="Calendar"
                            className="image-icon20"
                          />
                          <input
                            type="date"
                            value={date4}
                            onChange={(e) => setDate4(e.target.value)}
                          />
                        </div>

                        <div className="stomach-options">
                          {["Mild","Moderate", "Severe"].map((level) => (
                            <div
                              key={level}
                              className={`stomach-option ${severity4 === level ? "selected" : ""
                                }`}
                              onClick={() => handleSeverityChange4(level)}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="sav-btn20" onClick={handleSave4}>
                        Save
                      </button>
                    </div>
                  )}

                  {showHistory4 && historyData4.length > 0 && (
                    <div className="stomachhis-section20">
                      <table className="stomachhis-table20">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData4.map((entry, index) => (
                            <tr key={index}>
                              <td>{entry.date4}</td>
                              <td>{entry.severity4}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {lastChecked4 && (
                    <div className="stomach-display20">
                      <h3>Last Checked {lastChecked4.date4}</h3>
                      <div className="circle21">
                        <span>{lastChecked4.severity4}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div id="Neurology" className={`st-tab ${isActive === 5 ? "active" : ""}`}>
              <div className="st-imagebox-info">
                <div className="banner">
                  <h1>Stay on top of your health with our comprehensive health trackers!</h1>
                  <img src="https://preggerz.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/newtoolnew.png" alt="Health tracker illustration" className="banner-image" />
                </div>
                <div className="sleeptracker-container20">
                  <div className="sleeptrack-section20">
                    <h2>Track Your Sleep Cycle</h2>
                    <div className="butto-group20">
                      <button className="add-btn20" onClick={handleAddNew5}>
                        Add New
                      </button>
                      <button className="history-btn20" onClick={handleShowHistory5}>
                        History
                      </button>
                    </div>
                  </div>
                  {showForm5 && (
                    <div className="sleepinp-section20">
                      <div className="sleepinp-group20">
                        <div className="sleepinp-field20">
                          <img
                            src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2075.png"
                            alt="Calendar"
                            className="image-icon20"
                          />
                          <input
                            type="date"
                            value={date5}
                            onChange={(e) => setDate5(e.target.value)}
                          />
                        </div>
                        <div className="sleepinp-field20">
                          <img
                            src="https://cdn.storehippo.com/s/6123687a0e3882eabaee1e6e/ms.files/2%2076.png"
                            alt="Note"
                            className="image-icon20"
                          />
                          <input
                            type="number"
                            placeholder="Hours"
                            value={newSleep}
                            onChange={(e) => setNewSleep(e.target.value)}
                          />
                        </div>
                      </div>
                      <button className="sav-btn20" onClick={handleSave5}>
                        Save
                      </button>
                    </div>
                  )}

                  {showHistory5 && historyData5.length > 0 && (
                    <div className="sleephis-section20">
                      <table className="sleephis-table20">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Sleep</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData5.map((entry, index) => (
                            <tr key={index}>
                              <td>{entry.date5}</td>
                              <td>{entry.sleep}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* sleep Display Section - Debug log and relaxed check */}
                  {console.log('lastChecked5:', lastChecked5)}
                  {lastChecked5 && lastChecked5.date5 && typeof lastChecked5.sleep === 'number' && (
                    <div className="sleep-display20">
                      <h3>Last Checked {lastChecked5.date5}</h3>
                      <div className="circle21">
                        <span>{lastChecked5.sleep} Hrs</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  );
}; // Close main HealthTracker function

export default HealthTracker;
