export default function RoomGrid({ rooms }) {
    const sortedRooms = Object.keys(rooms).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 50px)', gap: '5px' }}>
            {sortedRooms.map((room) => (
                <div
                    key={room}
                    style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: rooms[room].booked ? 'red' : 'green',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid black',
                    }}
                >
                    {room}
                </div>
            ))}
        </div>
    );
}
