digital-housing-platform
📌 What This Project Is About
I built the Digital Housing Platform to help verified homeowners and renters connect easily and safely. It’s more than just listings — it’s about real conversations with real people. Whether it’s chatting in real time, hopping on a video call, or searching for a home in your village, this platform makes renting feel natural and trustworthy.
Down the road, I plan to add a smart assistant (using machine learning) that can predict if renters will pay their rent on time, making the whole process even smoother for everyone involved.

🎯 Why I Made It
To create a friendly, real-world way for people to rent homes

To let folks sign in quickly with Google — no hassle, just start looking

To make chatting and video calls part of the experience, so owners and renters can talk directly

To help renters find homes exactly where they want — down to the village level

To build trust with two-way ratings and an easy reporting system

To keep it all running smoothly with modern tech like Docker and CI/CD

🧑‍🤝‍🧑 Who’s Behind This
Full Stack Developer: That’s me! I’m building both the frontend with React and the backend with Node.js and Express, stitching everything together.

NoSQL Database Architect: I design how data is stored in MongoDB, making sure everything’s efficient and flexible.

Real-Time Communication Engineer: I handle live chat and video calls with Socket.io and WebRTC, so you feel like you’re talking face to face.

Machine Learning Integrator (coming soon!): I’m working on adding smart predictions to help owners decide who to rent to.

💻 What’s Under the Hood
ReactJS — makes the website fast and interactive

Node.js + Express — the engine running the backend

MongoDB (with Mongoose) — where all the data lives, flexible and scalable

Google OAuth + JWT — secure and simple login with your Google account

Socket.io — for real-time chat that feels instant

WebRTC / Agora.io — smooth video calls right in the browser

Docker — keeps development and production consistent

GitHub Actions — automates testing and deployment

Render / Railway / Vercel — cloud platforms that host the app online

🗂️ How the Data is Organized
Users
Each user has a profile including their name, email, role (renter or owner), verification status, Google account link, ratings, and any reports they may have.

Properties
Owners list homes with details like title, village location, price, description, photos, and availability.

Messages
Chat conversations between users are stored with sender and receiver info, timestamps, and read status.

Call Sessions
Video calls have records of who called whom, when it started and ended, and the call status.

Reservations
All booking details — who rented what, for how long, and the status of that booking.

Reviews
Both renters and owners can leave ratings and comments about each other.

Reports
If something goes wrong, users can report bad behavior — these reports help keep the community safe.

Payment Predictions (coming soon!)
Smart scores predicting how likely renters are to pay on time, helping owners make informed decisions.

✨ What You Can Do With This Platform
Sign In Easily
No need to remember a new password — just log in with Google and get started.

Chat & Video Call
Talk in real time with property owners or renters, ask questions, negotiate, and get to know each other better.

Search by Village
Looking for a home in a specific neighborhood or village? Filter listings easily to find what fits your needs.

Book & Manage Reservations
Reserve a place for your desired dates, track your booking status, and manage cancellations if needed.

Rate & Review
After a stay or rental, leave honest feedback to help others make good decisions.

Report Issues
See something suspicious? Report users to keep everyone safe and accountable.

(planned) Smart Predictions
Get insights on renter reliability powered by machine learning — a little extra peace of mind.

🔐 How We Keep Things Safe
Secure Google OAuth and JWT tokens protect your account

All data is sent over HTTPS

We validate and sanitize inputs to keep bad actors out

Rate limiting and protections prevent abuse

Reports are reviewed to keep the community healthy

⚙️ Behind the Scenes — CI/CD and DevOps
Automated testing helps catch bugs before they reach you

Docker ensures the app runs the same everywhere

GitHub Actions handle continuous integration and deployment

Hosted on cloud platforms for reliability and speed