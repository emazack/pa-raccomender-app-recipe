# Recipe App

Client-side React application that recommends recipes based on user preferences using the [TheMealDB](https://www.themealdb.com/api.php) API.

Built with **React 18**, **TypeScript**, and **Vite**.

## Features

* **Two-Step Wizard:** Guided flow to select Cuisine (Area) and a specific Ingredient.
* **Recommendation Engine:** Client-side logic to find the intersection between Area and Ingredient (since the API doesn't support dual filtering).
* **Dynamic Search:** Autocomplete functionality with local filtering for instant feedback.
* **Persistent History:** Likes and Dislikes are saved in `localStorage` and displayed in a dedicated History view.
* **Responsive Design:** optimized for mobile and desktop using SCSS Modules.

---

## Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  Clone the repository

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Run tests:
    ```bash
    npm test
    ```

---

## Architecture & Design Decisions

### 1. State Management: Context API + useReducer
I chose **Context API** combined with the **Reducer Pattern** over external libraries.
* **Why:** For an application of this scope it reduce complexity. The Reducer pattern ensures predictable state transitions (`SET_AREA`, `SET_INGREDIENT`, `RESET`).

### 2. The Client-Side Join
The public API provided (*TheMealDB*) does not support filtering by *Area* AND *Ingredient* simultaneously.
* **The Problem:** Requesting "Italian" gives a list. Requesting "Chicken" gives another list. The API cannot give "Italian Chicken".
* **My Solution:** I implemented a parallel fetching strategy in `src/utils/recommendationEngine.ts`:
    1.  Fetch Area meals and Ingredient meals in parallel using `Promise.all` (minimizing network latency).
    2.  Create a `Set` of IDs from one list for a fast search.
    3.  Filter the second list against the Set to find the intersection.
This ensures the recommendation strictly respects both constraints.

### 3. Service Layer Pattern
I abstracted all network logic into `src/api/mealService.ts`.
* **Why:** This decouples the UI components from the specific implementation of `fetch`.

### 4. Component Structure
* **`pages/`**: "Smart" components (Controllers) that handle data fetching, state connection, and routing.
* **`components/ui/`**: Reusable presentational components like `RecipeCard`, `Autocomplete`, and `HistoryItem`. They are reusable.

---

## Testing Strategy

The project uses **Vitest** and **React Testing Library**.

### Implemented Tests
* **Infrastructure/API Tests:** I implemented unit test for the `mealService` to ensure correct endpoint calls and error handling without making real network requests (using mocks).
* **Main Render:** Integration test (`App.test.tsx`) to verify the application mounts and renders core UI elements correctly.

---

## Tech Stack

* **Core:** React 18, TypeScript
* **Build Tool:** Vite
* **Routing:** React Router DOM v6
* **AI Powered Styling:** SCSS Modules + Global Variables
* **Testing:** Vitest, React Testing Library, jsdom
* **Icons:** React Icons

---

### Author
Emanuele Zaccaria