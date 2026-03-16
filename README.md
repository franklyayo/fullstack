# Technical Documentation: MERN E-Commerce Platform

## 1. System Architecture & Infrastructure
The application operates on a decoupled modern cloud architecture to separate frontend delivery from backend processing.

* **Frontend Hosting (Vercel):** Hosts the React/Redux SPA. Connected to the custom domain `ayokunle.org` (and `www` via 308 permanent redirect). Vercel handles automated Let's Encrypt SSL/TLS provisioning.
* **Backend API (Render):** A Node.js/Express server hosted on Render (`fullstack-ng6s.onrender.com`).
* **Database (MongoDB Atlas):** Fully managed NoSQL cloud database.
* **Asset Storage (Cloudinary):** Handles all user-uploaded product imagery, serving assets via secure absolute URLs to prevent mixed-content blocking.

## 2. Authentication, Security & CORS
The platform relies on stateless JWT authentication securely passed via HTTP-only cookies.

* **Cookie Configuration:** JWTs are issued with `sameSite: 'none'`, `secure: true`, and `httpOnly: true` flags to allow cross-origin session persistence between Render and Vercel.
* **CORS Policy:** The backend Express router uses a strict whitelist array for the `Access-Control-Allow-Origin` header. Authorized origins include:
  * `https://ayokunle.org`
  * `https://www.ayokunle.org`
  * `https://fullstack-rose-alpha.vercel.app`
* **Role-Based Access Control (RBAC):** * Implemented via a `role` integer on the User model.
  * `role: 0` (Default) = Standard User. Can browse, add to cart, and checkout.
  * `role: 1` = Administrator. Unlocks the `/product/upload` route and the `/admin/dashboard`. Backend API endpoints explicitly verify `req.user.role === 1` before querying sensitive data.

## 3. Core Features & Integrations
* **Payment Processing:** Integrated with the PayPal Developer SDK. Currently configured to the Sandbox environment (`client-id: "sb"`).
* **Admin Control Panel:** A protected dashboard built with Ant Design. Features real-time statistical readouts and paginated data tables for complete User Directories and Product Inventories.
* **State Management:** Redux handles user session state and cart data asynchronously to prevent UI rendering crashes on initial load.

## 4. Local Development Notes
* **Service Worker (PWA):** The Progressive Web App service worker in `client/src/index.js` is currently set to `unregister()`. This ensures aggressive caching is disabled during active development. Change to `register()` only when strictly locking a final production build.
* **Ant Design Mobile UI:** The responsive mobile slide-out navigation drawer has been customized from the default library placeholder to display "Menu".

## 5. Required Environment Variables
To run this application, the following `.env` configurations are required. Do not commit actual keys to version control.

**Client (`client/.env`)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PAYPAL_CLIENT_ID=sb
```

**Server (`server/.env`)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=<random_secure_string>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```
