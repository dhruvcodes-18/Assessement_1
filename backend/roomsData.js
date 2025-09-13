// Initialize rooms in-memory
const rooms = {};
for (let floor = 1; floor <= 10; floor++) {
    const roomCount = floor === 10 ? 7 : 10;
    for (let i = 1; i <= roomCount; i++) {
        const roomNumber = floor === 10 ? `100${i}` : `${floor}${(i < 10 ? '0' : '') + i}`;
        rooms[roomNumber] = { floor: floor, booked: false };
    }
}

module.exports = rooms;