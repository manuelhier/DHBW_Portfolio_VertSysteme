# DHBW_Portfolio_VertSysteme

## ER-Diagram

## API Endpunkte

| Beschreibung          | URL-Pfad             | `GET` | `POST` | `PUT` | `PATCH` | `DELETE` |
| --------------------- | -------------------- | :---: | :----: | :---: | :-----: | :------: |
| Ressource "Gerät"     | `/api/v1/device/:id` |   x   |        |       |    x    |    x     |
| Collection "Gerät"    | `/api/v1/device/`    |   x   |   x    |       |         |          |
| Ressource "Zimmer"    | `/api/v1/room/:id`   |   x   |        |       |    x    |    x     |
| Collection "Zimmer"   | `/api/v1/room/`      |   x   |   x    |       |         |          |
| Ressource "Benutzer"  | `/api/v1/user/:id`   |   x   |        |       |    x    |    x     |
| Collection "Benutzer" | `/api/v1/user/`      |   x   |   x    |       |         |          |

## Datenmodell