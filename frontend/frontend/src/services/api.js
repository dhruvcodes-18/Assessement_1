// Use environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getRooms() {
    const res = await fetch(`${API_URL}/rooms`);
    return res.json();
}

export async function bookRooms(numRooms) {
    const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numRooms }),
    });
    return res.json();
}

export async function randomOccupancy() {
    await fetch(`${API_URL}/random-occupancy`, { method: 'POST' });
}

export async function resetRooms() {
    await fetch(`${API_URL}/reset`, { method: 'POST' });
}

