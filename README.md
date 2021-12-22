# SteelNotifications

This project was generated using [Nx](https://nx.dev).

## How to start

- ```npm install```
- ```npm run build```
- ```docker-compose up```

Subscription form should be available at ```http://localhost:4200/```

Inbox should be available at ```http://localhost:8080/```

Checking Node app health at ```http://localhost:3333/api/notifications/health```

MongoDB available at ```localhost:27017```, ```test``` database

-----

Senders and intervals are hardcoded for simplicity,
in real app senders could be generated by factory using configuration stored in DB.
