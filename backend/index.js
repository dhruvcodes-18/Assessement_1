const express = require('express');
const cors = require('cors');
const path = require('path'); // For serving frontend
const rooms = require('./roomsData');


const app = express();
app.use(cors());
app.use(express.json());

// ----------------- Helper Functions -----------------

// Calculate total travel time between first and last room in the list
function calculateTravelTime(roomNumbers) {
    const sorted = roomNumbers.sort((a, b) => parseInt(a) - parseInt(b));
    let time = 0;
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const prevFloor = rooms[prev].floor;
        const currFloor = rooms[curr].floor;

        const verticalTime = Math.abs(currFloor - prevFloor) * 2;
        const horizontalTime = Math.abs(parseInt(curr) % 100 - parseInt(prev) % 100);

        time += verticalTime + horizontalTime;
    }
    return time;
}

// Get all currently available (unbooked) rooms
function getAvailableRooms() {
    return Object.keys(rooms).filter(room => !rooms[room].booked);
}

// Get all combinations of k elements from array
function getCombinations(arr, k) {
    const results = [];
    function backtrack(start, comb) {
        if (comb.length === k) {
            results.push([...comb]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            comb.push(arr[i]);
            backtrack(i + 1, comb);
            comb.pop();
        }
    }
    backtrack(0, []);
    return results;
}

// ----------------- API Routes -----------------

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.post('/random-occupancy', (req, res) => {
    Object.keys(rooms).forEach(room => {
        rooms[room].booked = Math.random() < 0.3;  // ~30% chance booked
    });
    res.json({ message: 'Random occupancy generated' });
});

app.post('/reset', (req, res) => {
    Object.keys(rooms).forEach(room => {
        rooms[room].booked = false;
    });
    res.json({ message: 'All rooms reset' });
});

app.post('/book', (req, res) => {
    const { numRooms } = req.body;

    if (numRooms > 5) {
        return res.status(400).json({ message: 'Cannot book more than 5 rooms at a time' });
    }

    const availableRooms = getAvailableRooms();

    if (availableRooms.length < numRooms) {
        return res.status(400).json({ message: 'Not enough rooms available' });
    }

    let bestSet = null;
    let minTravelTime = Infinity;

    // Group available rooms by floor
    const floors = {};
    availableRooms.forEach(room => {
        const floor = rooms[room].floor;
        if (!floors[floor]) floors[floor] = [];
        floors[floor].push(room);
    });

    // Try same-floor booking first
    for (const floor in floors) {
        const roomList = floors[floor].sort();
        for (let i = 0; i <= roomList.length - numRooms; i++) {
            const candidate = roomList.slice(i, i + numRooms);
            const travelTime = calculateTravelTime(candidate);
            if (travelTime < minTravelTime) {
                minTravelTime = travelTime;
                bestSet = candidate;
            }
        }
    }

    // If no valid same-floor set, try all combinations across floors
    if (!bestSet) {
        const combinations = getCombinations(availableRooms, numRooms);
        combinations.forEach(set => {
            const time = calculateTravelTime(set);
            if (time < minTravelTime) {
                minTravelTime = time;
                bestSet = set;
            }
        });
    }

    if (!bestSet) {
        return res.status(400).json({ message: 'Unable to allocate rooms' });
    }

    // Mark selected rooms as booked
    bestSet.forEach(room => (rooms[room].booked = true));

    res.json({ bookedRooms: bestSet });
});

// ----------------- Serve Frontend -----------------

// Correct path for your nested frontend folder
const frontendPath = path.resolve(__dirname, '../frontend/frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ----------------- Start Server -----------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

