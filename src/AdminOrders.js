import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig'; // Adjust this import to match your Firebase config path
import { useNavigate } from 'react-router-dom'; // Using React Router for navigation

const AdminOrders = () => {
    const navigate = useNavigate(); // Use React Router for navigation
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
        navigate('/DetailedOrders', { state: { order } }); // Navigate to DetailedOrder page with order details
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Customer Orders</h1>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                        <p style={styles.orderText}><strong>Booking Number:</strong> {item.bookingNumber}</p>
                        <p style={styles.orderText}><strong>Name:</strong> {item.userEmail}</p>
                        <p style={styles.orderText}><strong>Total Cost:</strong> R{item.totalCost}</p>
                        <button 
                            onClick={() => handleViewMore(item)} 
                            style={styles.viewMoreButton}
                        >
                            View More
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    orderItem: {
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    orderText: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    viewMoreButton: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px',
    }
};

export default AdminOrders;
