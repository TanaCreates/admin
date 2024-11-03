import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Adjust the import based on your file structure
import { ref, onValue, remove, update, get } from 'firebase/database';
import './CustomerRequestResponse.css'; // Import the CSS file

const CustomerRequestResponse = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const requestRef = ref(db, 'requests');
        const unsubscribe = onValue(requestRef, (snapshot) => {
            const requestData = snapshot.val() || {};
            const loadedRequests = Object.keys(requestData).map((key) => ({
                id: key,
                ...requestData[key],
            }));
            setRequests(loadedRequests);
        });

        return () => unsubscribe();
    }, []);

    const handleRespond = async (requestId, request) => {
        try {
            // Step 1: Fetch the current quantities from the 'Toiletries' database
            const toiletriesRef = ref(db, 'Toiletries');
            const snapshot = await get(toiletriesRef);
    
            if (!snapshot.exists()) {
                throw new Error("Toiletries data not available");
            }
    
            const toiletries = snapshot.val();
    
            // Step 2: Deduct the requested quantities, ensuring safe values
            const updatedToiletries = {
                blanket: (toiletries.blanket || 0) - (request.quantities.blanket || 0),
                extraStorage: (toiletries.extraStorage || 0) - (request.quantities.extraStorage || 0),
                pillows: (toiletries.pillows || 0) - (request.quantities.pillows || 0),
            };
    
            // Check if any of the updated quantities are below zero
            if (
                updatedToiletries.blanket < 0 ||
                updatedToiletries.extraStorage < 0 ||
                updatedToiletries.pillows < 0
            ) {
                window.alert('Insufficient stock to fulfill the request.');
                return;
            }
    
            // Step 3: Update the 'Toiletries' database with the new quantities
            await update(toiletriesRef, updatedToiletries);
    
            // Step 4: Remove the request after successfully updating the toiletries
            await remove(ref(db, `requests/${requestId}`));
    
            window.alert('Request responded to successfully and toiletries updated!');
        } catch (error) {
            console.error('Error processing request:', error);
            window.alert('Failed to respond to the request.');
        }
    };
    

    return (
        <div>
            <h2>Customer Requests</h2>
            <div>
                {requests.length === 0 ? (
                    <p>No requests available.</p>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="request-container">
                            {/* Left section */}
                            <div className="request-left">
                                <p>Name: {request.name}</p>
                                <p>Pod ID: {request.podId}</p>
                                <p>Submitted Date: {request.submittedDate}</p>
                                <p>Submitted Time: {request.submittedTime}</p>
                            </div>

                            {/* Middle section */}
                            <div className="request-middle">
                                <p>Blankets : {request.quantities.blanket}</p>
                                <p>Extra Storage : {request.quantities.extraStorage}</p>
                                <p>Pillows : {request.quantities.pillows}</p>
                                {/* Removed WiFi Code request line since it is no longer part of quantities */}
                            </div>

                            {/* Right section */}
                            <div className="request-right">
                                <button onClick={() => handleRespond(request.id, request)}>Respond</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerRequestResponse;
