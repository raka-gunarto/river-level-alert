function rawToCentimeters(raw) {
    // raw is in microseconds, so 29 microseconds per centimeter
    // div by 2 to get one way distance
    return raw / 29 / 2;
}

module.exports = {
    sensor_3: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 480;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 110,
        warnLevel: 160,
        dangerLevel: 200,
        name: 'Sungai Jali',
        location: 'somewhere',
    },
    sensor_1: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 470;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 70,
        warnLevel: 100, 
        dangerLevel: 150,
        name: 'Sungai Dulang',
        location: 'somewhere',
    },
    sensor_2: {
        calculateWaterLevel: (raw) => {
            const heightCalibration = 400;
            let cm = rawToCentimeters(raw);
            return heightCalibration - cm;
        },
        safeLevel: 50,
        warnLevel: 100,
        dangerLevel: 150,
        name: 'Sungai Balong',
        location: 'somewhere',
    },
};
