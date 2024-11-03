// src/MenuInventory.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';

const MenuInventory = () => {
    const [menuData, setMenuData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch menu data function
    const fetchMenuData = (query = '') => {
        const menuRef = ref(db, 'Menu'); // Reference to the 'Menu' path in the db

        onValue(menuRef, snapshot => {
            const menu = snapshot.val();
            const menuArray = [];

            for (const categoryKey in menu) {
                if (menu.hasOwnProperty(categoryKey)) {
                    const category = menu[categoryKey];
                    for (const itemKey in category) {
                        if (category.hasOwnProperty(itemKey)) {
                            const item = category[itemKey];
                            if (query && !item.item.toLowerCase().includes(query.toLowerCase())) {
                                continue;
                            }
                            menuArray.push({ ...item, category: categoryKey, id: itemKey });
                        }
                    }
                }
            }
            setMenuData(menuArray);
        });
    };

    useEffect(() => {
        fetchMenuData(); // Fetch initial data
    }, []);

    const handleSearch = () => {
        fetchMenuData(searchQuery);
    };

    const styles = {
        body: {
            padding: '20px',
            backgroundColor: '#f4f4f4',
        },
        h1: {
            textAlign: 'center',
            color: '#333',
        },
        searchContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
        },
        input: {
            padding: '10px',
            fontSize: '16px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        button: {
            padding: '10px 15px',
            fontSize: '16px',
            marginLeft: '10px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#5cb85c',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#4cae4c',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        thTd: {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'left',
            backgroundColor: '#fff',
        },
        itemImage: {
            width: '50px',
            height: '50px',
            borderRadius: '4px',
        },
    };

    return (
        <div style={styles.body}>
            <h1 style={styles.h1}>Menu Inventory</h1>
            <div style={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Search by Item Name" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={styles.input} 
                />
                <button 
                    onClick={handleSearch} 
                    style={styles.button} 
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor} 
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Search
                </button>
                <button 
                    onClick={() => fetchMenuData()} 
                    style={styles.button} 
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor} 
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Show All Menu Items
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.thTd}>Category</th>
                        <th style={styles.thTd}>Item</th>
                        <th style={styles.thTd}>Price</th>
                        <th style={styles.thTd}>Availability</th>
                        <th style={styles.thTd}>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {menuData.map(item => (
                        <tr key={item.id} style={{ cursor: 'pointer' }}>
                            <td style={styles.thTd}>{item.category}</td>
                            <td style={styles.thTd}>{item.item}</td>
                            <td style={styles.thTd}>R{item.price}</td>
                            <td style={styles.thTd}>{item.availability ? 'Available' : 'Unavailable'}</td>
                            <td style={{
                                ...styles.thTd,
                                backgroundColor: item.quantity < 10 ? '#f8d7da' : '#fff',
                                color: item.quantity < 10 ? '#721c24' : '#000'
                            }}>
                                {item.quantity}
                                {item.quantity < 10 && <span> (Low stock)</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuInventory;
