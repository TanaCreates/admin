import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Ensure Firebase is configured for web
import { ref, onValue, update, remove, set } from 'firebase/database';
import './AddPodForm.css'; // Import the CSS file

const AddPodForm = () => {
    const [pods, setPods] = useState([]);
    const [editPodId, setEditPodId] = useState(null);
    const [nextPodId, setNextPodId] = useState('A10'); // Starting from A10
    const [bedNumber, setBedNumber] = useState('');
    const [podPrice, setPodPrice] = useState('');
    const [podAvailability, setPodAvailability] = useState(true);
    const [podStatus, setPodStatus] = useState('available'); // Can be 'available' or 'under maintenance'
    const [personCount, setPersonCount] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [amenities, setAmenities] = useState(''); // Comma-separated amenities
    const [showingPods, setShowingPods] = useState(true); // State for toggling between views
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const podRef = ref(db, 'sleepingPods');
        const unsubscribe = onValue(podRef, (snapshot) => {
            const podData = snapshot.val() || {};
            const loadedPods = Object.keys(podData).map((key) => ({
                id: key,
                ...podData[key],
            }));
            setPods(loadedPods);

            // Update the next Pod ID based on the number of existing pods
            const currentPodId = loadedPods.length + 10;
            setNextPodId(`A${Math.min(currentPodId, 20)}`);
        });

        return () => unsubscribe();
    }, []);

    const handleAddPod = async () => {
        if (!bedNumber || !podPrice || !personCount || !imageUrl) {
            window.alert('Error: Please fill in all fields');
            return;
        }

        const podData = {
            podId: nextPodId,
            bedNumber: bedNumber,
            price: podPrice,
            availability: podStatus === 'under maintenance' ? false : podAvailability,
            status: podStatus,
            personCount: personCount,
            imageUrl: imageUrl,
            amenities: amenities.split(',').map((item) => item.trim()),
        };

        try {
            const podRef = ref(db, `sleepingPods/${nextPodId}`);
            await set(podRef, podData);
            window.alert('Success: Sleeping pod added!');
            resetForm();
        } catch (error) {
            console.error('Error adding pod:', error);
            window.alert('Error: Could not add sleeping pod');
        }
    };

    const handleEditPod = (pod) => {
        setEditPodId(pod.id);
        setBedNumber(pod.bedNumber);
        setPodPrice(pod.price);
        setPodAvailability(pod.availability);
        setPodStatus(pod.status);
        setPersonCount(pod.personCount);
        setImageUrl(pod.imageUrl);
        setAmenities(pod.amenities ? pod.amenities.join(', ') : '');
    };

    const handleUpdatePod = async () => {
        if (!bedNumber || !podPrice || !personCount || !imageUrl) {
            window.alert('Error: Please fill in all fields');
            return;
        }

        const podData = {
            bedNumber: bedNumber,
            price: podPrice,
            availability: podStatus === 'under maintenance' ? false : podAvailability,
            status: podStatus,
            personCount: personCount,
            imageUrl: imageUrl,
            amenities: amenities.split(',').map((item) => item.trim()),
        };

        try {
            await update(ref(db, `sleepingPods/${editPodId}`), podData);
            window.alert('Success: Sleeping pod updated!');
            resetForm();
        } catch (error) {
            console.error('Error updating pod:', error);
            window.alert('Error: Could not update sleeping pod');
        }
    };

    const handleDeletePod = async (podId) => {
        try {
            await remove(ref(db, `sleepingPods/${podId}`));
            window.alert('Success: Sleeping pod deleted!');
        } catch (error) {
            console.error('Error deleting pod:', error);
            window.alert('Error: Could not delete sleeping pod');
        }
    };

    const resetForm = () => {
        setEditPodId(null);
        setBedNumber('');
        setPodPrice('');
        setPodAvailability(true);
        setPodStatus('available');
        setPersonCount('');
        setImageUrl('');
        setAmenities('');
    };

    const filteredPods = pods.filter((pod) =>
        pod.podId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderPod = (item) => (
        <div className="podContainer">
            <p>Pod ID: {item.podId}</p>
            <p>Bed Number: {item.bedNumber}</p>
            <p>Price: {item.price}</p>
            <p>Availability: {item.availability ? 'True' : 'False'}</p>
            <p>Status: {item.status}</p>
            <p>Person Count: {item.personCount}</p>
            <p>Image URL: {item.imageUrl}</p>
            <p>Amenities: {item.amenities ? item.amenities.join(', ') : 'None'}</p>
            <div className="buttonContainer">
                <button className="editButton" onClick={() => handleEditPod(item)}>Edit</button>
                <button className="deleteButton" onClick={() => handleDeletePod(item.id)}>Delete</button>
            </div>
        </div>
    );

    return (
        <div className="container">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by Pod ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="searchInput"
            />

            <div className="categoryButtons">
                <button className="categoryButton" onClick={() => setShowingPods(true)}>Existing Pods</button>
                <button className="categoryButton" onClick={() => setShowingPods(false)}>Add Sleeping Pod</button>
            </div>

            {/* Conditional Rendering */}
            {showingPods ? (
                <div className="podsList">
                    {filteredPods.map(renderPod)}
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Bed Number"
                        value={bedNumber}
                        onChange={(e) => setBedNumber(e.target.value)}
                        className="input"
                    />
                    <input
                        type="text"
                        placeholder="Pod Price"
                        value={podPrice}
                        onChange={(e) => setPodPrice(e.target.value)}
                        className="input"
                    />
                    <input
                        type="text"
                        placeholder="Person Count"
                        value={personCount}
                        onChange={(e) => setPersonCount(e.target.value)}
                        className="input"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input"
                    />
                    <input
                        type="text"
                        placeholder="Amenities (comma separated)"
                        value={amenities}
                        onChange={(e) => setAmenities(e.target.value)}
                        className="input"
                    />

                    {/* Availability Toggle */}
                    <div className="toggleContainer">
                        <p>Availability:</p>
                        <button onClick={() => setPodAvailability(!podAvailability)}>
                            {podAvailability ? "Set to False" : "Set to True"}
                        </button>
                    </div>

                    {/* Status Toggle */}
                    <div className="toggleContainer">
                        <p>Status:</p>
                        <button
                            onClick={() => {
                                if (podStatus === 'available') {
                                    setPodStatus('under maintenance');
                                    setPodAvailability(false);
                                } else {
                                    setPodStatus('available');
                                    setPodAvailability(true);
                                }
                            }}
                        >
                            {podStatus === 'available' ? "Set to Under Maintenance" : "Set to Available"}
                        </button>
                    </div>

                    <div className="buttonContainer">
                        {editPodId ? (
                            <button className="submitButton" onClick={handleUpdatePod}>Update Pod</button>
                        ) : (
                            <button className="submitButton" onClick={handleAddPod}>Add Pod</button>
                        )}

                        {editPodId && <button className="resetButton" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPodForm;
