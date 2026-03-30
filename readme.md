# ✈️ AbroadLift - International Education Platform

AbroadLift is a comprehensive platform designed to streamline and revolutionize the international university enrollment process. It provides a unified ecosystem for students to discover, compare, and apply to top-tier educational institutions worldwide.

The project is structured as a monorepo containing both a premium web application and a native mobile client.

---

## 🏗️ Repository Structure

- **`/client`**: The primary web application built with **Next.js**, **TailwindCSS**, and **Prisma**. It serves as the main administrative and student portal for browsing universities and managing applications.
- **`/phoneClient`**: The native mobile application developed with **React Native** and **Expo**. It provides a premium, portable user experience with a custom glassmorphic design system and stylized dashboard.

---

## 📱 Mobile Client (`/phoneClient`)

The mobile app focuses on a high-fidelity, native experience for students on the go.

### Key Features
- **Native Tab Dashboard**: Custom implementation of Expo Router tabs for Home, Search, Saved, and Profile.
- **Onboarding Flow**: Stylized multi-step registration process capturing Country, Degree, and Financial preferences.
- **Glassmorphic UI**: A modern design language utilizing soft translucency, vibrant teal gradients (`#1A8A99`), and interactive micro-animations.
- **Dynamic University Profiles**: Detailed institution views with global rankings, tuition data, and integrated application buttons.

### Tech Stack
- React Native / Expo Go
- Expo Router (File-based navigation)
- MaterialCommunityIcons & Feather iconography suites

---

## 💻 Web Client (`/client`)

The web platform provides the heavy-lifting infrastructure for data management and detailed exploration.

### Key Features
- **Full-stack Architecture**: Powered by Next.js App Router for server-side rendering and SEO optimization.
- **Database Integration**: Prisma ORM for type-safe database access and streamlined migrations.
- **Modern Responsive UI**: Crafted with React and TailwindCSS for a weightless, professional editorial feel.

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: (LTS v18+ recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Mobile Emulators**: iOS Simulator (Xcode) or Android Emulator (Android Studio) for phone testing.

### Steps to Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-repo]/abroadLift.git
   ```

2. **Web Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Mobile Client Setup**:
   ```bash
   cd phoneClient
   npm install
   npx expo start
   ```

---

## 🛠️ Combined Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Web Frontend** | Next.js, TailwindCSS |
| **Mobile Frontend** | React Native, Expo |
| **Authentication** | Custom JWT / Clerk (Planned) |
| **ORM / Database** | Prisma |
| **Routing** | Expo Router (Mobile) / App Router (Web) |

---

*Connecting ambitious students to global opportunities.*
