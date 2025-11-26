# 🌐 Knowledge Hub: Personal Knowledge System (Frontend)

## ✨ Overview

This repository contains the Single-Page Application (SPA) frontend for the **Knowledge Hub** project. It provides a modern, interactive interface for managing personal notes and links, communicating with the Spring Boot API to handle authentication, data management, and full-text search.

### Application Features

* **Full CRUD Cycle:** Create, View, Edit, and Delete Notes and Links.
* **Rich Text Editing:** Integrated **Tiptap** (ProseMirror-based) editor for creating formatted notes.
* **Link Previews:** Uses the backend Jsoup parser (`/links/parse`) to fetch metadata previews.
* **Live Search:** Integrated global search functionality using the Elasticsearch API.
* **Export:** Triggers backend PDF and Markdown generation endpoints for content downloading.
* **Internationalization (i18n):** Supports multiple languages (English, Russian, French).
* **Secured Routing:** Uses **Pinia** and **Vue Router** guards for JWT-based session management.

### Tech Stack

| Category | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | Vue.js 3 | Composition API, `<script setup>`. |
| **State Mgt.** | Pinia | Modern, lightweight state management. |
| **Routing** | Vue Router | Protected routing with auth guards. |
| **Styling** | Bootstrap 5, Font Awesome | Responsive design and iconography. |
| **Editor** | Tiptap (ProseMirror) | HTML-based rich text editing. |
| **Language** | TypeScript, Vue I18n | Strict typing and internationalization. |
| **Tooling** | Vite, ESLint, Prettier | Fast build and development experience. |

---

## ⚙️ Project Setup and Run Instructions

### Prerequisites

* **Node.js (v18 or v20 LTS)**
* **Backend Running:** The [Knowledge Hub Spring Backend](https://github.com/smerteliko/knowledge-hub-backend-spring) must be running and accessible at `http://localhost:8080`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/smerteliko/knowledge-hub-frontend-vue.git](https://github.com/smerteliko/knowledge-hub-frontend-vue.git)
    cd knowledge-hub-frontend-vue
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API URL:**
    The application defaults to connecting to `http://localhost:8080/api/v1`. You can change this in your `.env` file using the `VITE_API_BASE_URL` variable.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will launch on `http://localhost:5173`.

---

## 🧪 Testing and CI/CD

### Local Testing

To run the linter and type checker locally:
```bash
npm run lint
npm run type-check
```

-----

## 🤝 Contributing

I welcome any suggestions and feedback for improvement. If you find a bug or want to propose a new feature, please create a **GitHub Issue** or a **Pull Request**.

-----

## 👨‍💻 Contact

* **Name:** Nikolay Makarov
* **GitHub:** https://github.com/smerteliko
* **LinkedIn:** https://www.linkedin.com/in/nikolay-makarov/