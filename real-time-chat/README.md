# ChatConnect

A real-time chat and group communication app built with React, Express, MongoDB, and Socket.IO.

## Features

- Login and registration with hashed passwords and signed 24-hour access tokens.
- Role-aware accounts: administrator, registered user, and group administrator (group creator).
- Workspace screens for overview, messages, contacts, groups, notifications, reports, and account settings.
- Public general chat, private direct messages, group chat, saved history, timestamps, and sent/delivered status.
- Contact discovery and management, group creation, membership administration, and member self-removal.
- Per-user chat clearing, and owner/admin group deletion with the group's messages.
- Administrator reports for membership participation, group activity, user activity, and group creation.
- Responsive interface, Docker Compose, and Kubernetes deployment manifests.

## Run locally

Requirements: Node.js 20 or newer, npm, and a reachable MongoDB instance.

1. Copy `backend/.env.example` to `backend/.env`, then set `MONGO_URI`, a strong `JWT_SECRET`, and `ADMIN_EMAIL`.
2. Register the account that matches `ADMIN_EMAIL` to create the administrator. New accounts otherwise receive the registered-user role. The first user to create a group receives the group-administrator role.
3. Start the API:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

4. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`. The API listens on port 5000.

The backend accepts a comma-separated `FRONTEND_ORIGIN` list to configure CORS (the default allows both `localhost:5173` and `127.0.0.1:5173`) and `PORT` to change its listening port. MongoDB Atlas SRV records are resolved using Google's public DNS servers because some local DNS resolvers refuse SRV lookups. If `JWT_SECRET` is omitted in local development, a temporary random key is generated; this invalidates sessions on server restart. Always configure a persistent secret outside local development.

## Public deployment

GitHub Pages hosts only the frontend; it cannot run the Express/Socket.IO backend or MongoDB. Deploy the backend and configure a cloud MongoDB database separately. Set the backend's `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_ORIGIN` environment variables, with `FRONTEND_ORIGIN` set to `https://aithasiddartha28.github.io`.

In the GitHub repository, add an Actions variable named `VITE_API_URL` under **Settings → Secrets and variables → Actions → Variables**. Set it to the deployed backend's public origin (for example, `https://your-backend.example.com`, without a trailing slash), then rerun the **Deploy ChatConnect to GitHub Pages** workflow. Register a new account on the public site after the backend is connected.

## Docker Compose

Set `MONGO_URI`, `JWT_SECRET`, and (optionally) `ADMIN_EMAIL` in the environment, then run:

```powershell
docker compose up --build
```

Open `http://localhost:8080`. The frontend container's Nginx server forwards API and Socket.IO traffic to the backend. Compose does not include MongoDB; configure `MONGO_URI` to point at your database.

## Kubernetes

Build and publish the `chat-backend` and `chat-frontend` images, then create the required secret and apply the manifest:

```powershell
kubectl create secret generic chat-secrets `
  --from-literal=MONGO_URI="<your-mongodb-uri>" `
  --from-literal=JWT_SECRET="<long-random-secret>"
kubectl apply -f k8s/chat.yaml
```

Update the image names in `k8s/chat.yaml` if using a container registry. Set `ADMIN_EMAIL` in the `chat-config` ConfigMap before registering the administrator account. The frontend `LoadBalancer` service is the entry point; its Nginx configuration proxies `/api` and `/socket.io` to the in-cluster backend service.

## Reports and roles

Administrator accounts can view all four reports in the Reports screen. Administrators are assigned by setting `ADMIN_EMAIL` before registration. Group creators receive the group-administrator role and can add members or remove members; any member can leave a group except its creator. Access to API routes and Socket.IO connections requires a signed-in session.

Clearing chat hides messages only for the current user's browser and does not delete shared message history. A group member can leave while other members continue chatting. The group owner or an administrator can permanently delete a group and its messages for everyone.
