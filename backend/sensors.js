function rawToCentimeters(raw) {
    // raw is in microseconds, so 29 microseconds per centimeter
    // div by 2 to get one way distance
    return raw / 29 / 2;
}

module.exports = {
    sensor_1: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 50;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 20,
        warnLevel: 24,
        dangerLevel: 28,
        name: 'sungai 1',
        location: 'somewhere',
    },
    sensor_2: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 50;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 20,
        warnLevel: 24,
        dangerLevel: 28,
        name: 'sungai 2',
        location: 'somewhere',
    },
    sensor_3: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 50;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 20,
        warnLevel: 24,
        dangerLevel: 28,
        name: 'sungai 3',
        location: 'somewhere',
    },
};
