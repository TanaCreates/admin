import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom'; // Use React Router for navigation
import './Booking.css'; // Import the CSS file if necessary

const Bookings = () => {
    const navigate = useNavigate(); // React Router hook
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch bookings from Firebase
        const ordersRef = ref(db, 'bookings/');
        onValue(ordersRef, (snapshot) => {
            const orderData = [];
            snapshot.forEach((childSnapshot) => {
                const order = childSnapshot.val();
                order.id = childSnapshot.key; // Add Firebase key to order data
                orderData.push(order);
            });
            setOrders(orderData);
        });
    }, []);

    const handleViewMore = (order) => {
        navigate('/DetailedBookings', { state: { order } }); // Pass order details to DetailedOrder using state
    };

    return (
        <div className="container">
            <h1 className="header">Customer Bookings</h1>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((item) => (
                    <div key={item.id} className="orderItem">
                        <p className="orderText">Booking Number: {item.bookingNumber}</p>
                        <p className="orderText">Email: {item.email}</p>
                        <p className="orderText">Total Cost: R{item.price}</p>
                        <button onClick={() => handleViewMore(item)}>View More</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Bookings;
