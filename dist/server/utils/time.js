export const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    let [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    while (startHour < endHour ||
        (startHour === endHour && startMin < endMin)) {
        const slot = `${startHour.toString().padStart(2, "0")}:${startMin
            .toString()
            .padStart(2, "0")}`;
        slots.push(slot);
        startMin += duration;
        while (startMin >= 60) {
            startMin -= 60;
            startHour += 1;
        }
    }
    return slots;
};
