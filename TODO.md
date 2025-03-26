# TODO

## Smart-Home-Controller

- [ ] Fix service classes
- [ ] Change DB setup?
- [ ] Simplify controller and move domain logic to dedicated service function
  - [ ] Input validation and error handling stays in controller
  - [ ] Rest is moved in service
- [ ] Change MQTT setup? Static connection?

### Device
- [x]  Support room deviceList
  - [x]  Add device -> Update deviceList
  - [x]  Change device -> Update deviceList
  - [x]  Delete device -> Update deviceList

### Room
- [ ] Implement deviceList
  - [ ] Add device to deviceList -> update devices
  - [ ] Implement device validation, and reject devices that are not found
  - [ ] Remove device from deviceList -> update devices
  - [x] Delete room -> Update all devices


## Submition
- [ ] Enhanced testing
- [ ] Check swagger
- [ ] Update README
  - [ ] Explain Logic