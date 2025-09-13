import { useEffect, useState } from 'react';
import BookingForm from './components/BookingForm.jsx';
import RoomGrid from './components/RoomGrid.jsx';
import { getRooms, bookRooms, randomOccupancy, resetRooms } from './services/api';

function App() {
    const [rooms, setRooms] = useState({});

    const loadRooms = async () => {
        const data = await getRooms();
        setRooms(data);
    };

    const handleBook = async (numRooms) => {
        await bookRooms(numRooms);
        loadRooms();
    };

    const handleRandom = async () => {
        await randomOccupancy();
        loadRooms();
    };

    const handleReset = async () => {
        await resetRooms();
        loadRooms();
    };

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Hotel Room Booking System By Dhruv Sinha</h1>
            <BookingForm onBook={handleBook} onRandom={handleRandom} onReset={handleReset} />
            <RoomGrid rooms={rooms} />
        </div>
    );
}

export default App;
