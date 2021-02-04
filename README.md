# River Level Sensor Alerts

Small system to keep track of various river water levels and send alerts

TODOs:
- [ ] Backend logic
    - [ ] Firebase push notifications
        - [ ] Subscribe to notifs
        - [ ] Send warn and danger notifs
    - [x] Datapoints
        - [x] Receive datapoints from sensors
        - [x] Send datapoints from app clients
- [ ] Frontend
    - [ ] Layout
        - [ ] Sidebar
        - [ ] Water level reading
        - [ ] Water level graph
    - [ ] Backend integration
        - [ ] Sidebar populate sensors from server
        - [ ] Regularly request water level from server
        - [ ] Select sensors to subscribe to
    - [ ] Push notifs
        - [ ] Receive push notifs from server
            - [ ] Display notification
- [ ] Hardware sensor logic
    - [ ] Water level logic
    - [ ] Send water level to server
    - [ ] Deepsleep loop