module.exports = function (messaging) {
    return {
        sendDangerNotif: (sensorID) => {
            messaging.send({
                data: {
                    severity: 'danger'
                },
                topic: sensorID
            })
        },
        sendWarnNotif: (sensorID) => {
            messaging.send({
                data: {
                    severity: 'warn'
                },
                topic: sensorID
            })
        },
    };
};
