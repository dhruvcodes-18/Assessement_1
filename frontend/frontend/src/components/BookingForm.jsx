import { useState } from 'react';

export default function BookingForm({ onBook, onRandom, onReset }) {
    const [numRooms, setNumRooms] = useState(1);

    return (
        <div>
            <input
                type="number"
                min="1"
                max="5"
                value={numRooms}
                onChange={(e) => setNumRooms(Number(e.target.value))}
            />
            <button onClick={() => onBook(numRooms)}>Book Rooms</button>
            <button onClick={onRandom}>Random Occupancy</button>
            <button onClick={onReset}>Reset Booking</button>
        </div>
    );
}
