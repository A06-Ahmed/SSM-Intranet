// src/components/Loading.jsx
import React from 'react';
import { HashLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div style={styles.container}>
            <HashLoader color="#001ba1" size={60} />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full screen height
        width: '100vw',  // Full screen width
        backgroundColor: '#ffffff'
    }
};

export default Loading;