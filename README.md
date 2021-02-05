# River Level Sensor Alerts

Small system to keep track of various river water levels and send alerts

TODOs:
- [x] Backend logic
    - [x] Firebase push notifications
        - [x] Subscribe to notifs
        - [x] Send warn and danger notifs
    - [x] Datapoints
        - [x] Receive datapoints from sensors
        - [x] Send datapoints from app clients
- [ ] Frontend
    - [x] Layout
        - [x] Sidebar
        - [x] Water level reading
        - [x] Water level graph
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