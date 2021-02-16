module.exports = function (messaging) {
    return {
        sendEvacuateNotif: (sensorID, sensorName) => {
            messaging.send({
                data: {
                    severity: 'evacuate',
                    river: sensorName
                },
                topic: sensorID,
            });
        },
        sendDangerNotif: (sensorID, sensorName) => {
            messaging.send({
                data: {
                    severity: 'danger',
                    river: sensorName
                },
                topic: sensorID,
            });
        },
        sendWarnNotif: (sensorID, sensorName) => {
            messaging.send({
                data: {
                    severity: 'warn',
                    river: sensorName
                },
                topic: sensorID,
            });
        },
    };
};
