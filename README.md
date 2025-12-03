# **AUSL Live Softball Stats API - Josh Gould and Bardia Ahmadi Dafchahi**

### A full-stack system that collects, processes, and serves live softball statistics through a unified API.

**Bitbucket Repository: [https://bitbucket.org/bardiaah2/aimvp/src/main/](https://bitbucket.org/bardiaah2/aimvp/src/main/)**

**Canvas Demo Video: https://uoregon.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=1696edaa-64f0-4e02-881e-b3a8009a4a78**

We were having trouble uploading the vidoe to canvas so here is link to the raw video it is also included in the bitbucket repo

---

## **📌 Project Summary**

This project provides an automated and centralized stats backend for the AUSL Softball League.

It scrapes game data, stores it in MongoDB, and exposes structured endpoints for pitching, hitting, MVP scoring, combined totals, and more. The system uses multiple coordinated services (Flask + Node.js + MongoDB), all run through Docker Compose.

Recently, we added a **temporary login page** to protect user access to the dashboard. For the purposes of our project demo, we created a test account with username **`admin`** and password  **`1234`** .

Additional features include:

* **Rank Watch:** Shows how much a player has improved or fallen behind each week and provides a detailed point breakdown—something the original website did not offer.
* **Player Bios:** Click on a player to view personal bios and more detailed information.
* **Cookie-based Security:** Clients receive a cookie that times out after 30 minutes. If a client does not have a valid cookie, they are automatically redirected to the login page.
* **Web Scraper:** Automates the collection of player stats for future games and competitions. The scraper visits event pages, collects all relevant stat links, extracts HTML tables, and converts them to JSON for storage in MongoDB. This allows the system to dynamically update and aggregate player stats without manual data entry.

For this project, we focused on the  **2025 ALLStar Cup** , showcasing all the above features for this tournament.

We have all these extra buttons and links like Stoer, About, Media, Scores, .. , etc. Becuase we rebuilt how the homepage worked to showcase to some stockholders in the AUSL. Obviosuly we didn't have access to the rest of the data to make those pages work.

---

## **🧰 Tech Stack**

### **Backend Services**

* **Flask (Python 3.x)** — API for CRUD operations and data retrieval
* **Node.js (v18+)** — Web scraping + live stat ingestion
* **MongoDB (v6.x)** — Primary database for all league data
* **Docker Compose** — Multi-container orchestration for all services

### **Web Scraper (Python)**

* **Python 3.x** — Main language for the scraper
* **Playwright** — Browser automation to handle dynamic content
* **BeautifulSoup (bs4)** — HTML parsing
* **Pandas** — Table extraction and conversion to JSON
* **Pathlib / JSON / urllib** — File handling, URL parsing, and JSON output

### **Key Libraries**

#### *Flask*

* `pymongo`
* `flask-cors`

#### *Node.js*

* `axios`
* `cheerio`
* `dotenv`

---

## **🚀 How to Run Locally**

### **1. Clone the repository**

<pre class="overflow-visible!" data-start="2852" data-end="2909"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>git </span><span>clone</span><span> <your-bitbucket-url>
</span><span>cd</span><span> AUSL-MOCKUP
</span></span></code></div></div></pre>

### **2. Start everything with Docker Compose**

<pre class="overflow-visible!" data-start="2960" data-end="2997"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>docker-compose up --build
</span></span></code></div></div></pre>

### **3. Local Ports**

| Service         | Port  | Description                  |
| --------------- | ----- | ---------------------------- |
| Flask API       | 5000  | Main API server              |
| Node.js Scraper | 3001  | Scrapes + inserts live stats |
| MongoDB         | 27017 | Database (Hosted online)     |

Your API becomes available at:

<pre class="overflow-visible!" data-start="3351" data-end="3385"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>http://localhost:5000/api/
</span></span></code></div></div></pre>

---

## **💬 Required Questions**

### **1. What is cool about your project?**

The coolest part is that the entire system works together automatically:

Node.js scrapes real AUSL softball stats → stores them in MongoDB → Flask exposes them in real time through a clean REST API.

All pitching, hitting, MVP points, and combined stat calculations run dynamically.

The whole system is fully containerized, meaning anyone can run it instantly using Docker Compose.

This makes the project unique because it blends  **web scraping** ,  **API design** ,  **database modeling** , and **data analytics** into one integrated system.

Right now the webscraper isn't running because new games are not being played since the league is in the off season.

---

### **2. What AI tools did you use, and for what tasks?**

I used **ChatGPT and Copilot** throughout development. The majority of the time it was used to debug our code.

#### **AI-assisted tasks:**

* Node.js scraper logic
* Error handling & type conversion
* Docker Compose configuration
* README generation and documentation
* Prompting for code bug fixes

#### **Example prompts used:**

* “Fix this TypeError for combining MongoDB integer fields.”
* “Generate Docker Compose for Flask + Node + MongoDB.”

No external LLM endpoints or hidden APIs were used — only ChatGPT and Copilot for assistance and debugging.

---

### **3. What did you learn by building this project?**

I learned how to:

* Build a multi-service backend architecture
* Orchestrate services using Docker Compose
* Scrape and normalize live data using Node.js
* Design MongoDB collections for sports analytics
* Create reliable Flask APIs with proper CRUD operations
* Debug container-to-container networking

It also improved my ability to coordinate Python + JS + Database layers in one cohesive system.

---

### **4. What were the main technical challenges? How did you solve them?**

#### **Challenge 1 — Data type inconsistencies**

Scraped stats often came in as strings, breaking MongoDB math.

**Solution:** Normalize all incoming numeric fields in Node.js using `Number()` and validators.

---

#### **Challenge 2 — Merging stats across collections**

Combining hitting, pitching, and MVP points required for having the goal breakdown of points.

**Solution:** Have modularized frontend and backend, where in each layer a single task for combining and breakdown happens.

---

#### **Challenge 3 — Hosting**

As the idea for this project was from our friend, we wanted to be able to host it, but that was harder than expected.

**Solution:** Asking ChatGPT on recommendation of how to structure environmental variables and configurations.

---

This version fully integrates the web scraper description, its libraries/technologies, and keeps all your original sections intact.