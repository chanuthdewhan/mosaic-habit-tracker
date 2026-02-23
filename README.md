# <img src="assets/images/splash-icon-light.png" width="32" height="32" style="vertical-align:middle"/> Mosaic

> **Build habits. Track streaks. See your consistency come together.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61dafb.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28.svg?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.2-38bdf8.svg)](https://www.nativewind.dev/)

Mosaic is a modern habit tracking mobile app built with React Native (Expo). It helps users build consistent daily routines through a clean, intuitive interface — with real-time sync, streak tracking, and actionable analytics.

---

## 📱 Screenshots

> _Screenshots will be updated soon_

---

## ✨ Features

- **Habit Management** — Create, edit, and delete habits with custom icons, colors, and frequencies (daily / weekly / monthly)
- **Daily Dashboard** — Mark habits complete, track streaks, and view your daily progress at a glance
- **Consistency Heatmap** — Visualize your completion history across weeks
- **Analytics** — Completion rates, KPI cards, and per-habit breakdowns
- **Profile & Settings** — Edit name, upload/remove profile photo, toggle dark mode, manage notifications
- **Authentication** — Email/password sign up & sign in, forgot password via email reset, change password in-app
- **Dark Mode** — Full dark/light theme with persistence via AsyncStorage
- **Real-time Sync** — All data synced live via Firebase Firestore

---

## 🛠 Tech Stack

| Layer          | Technology                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------- |
| Framework      | [Expo](https://expo.dev) (React Native)                                                      |
| Navigation     | [Expo Router](https://expo.github.io/router) (file-based)                                    |
| Styling        | [NativeWind v4](https://www.nativewind.dev/docs/getting-started/installation) (Tailwind CSS) |
| Backend        | [Firebase](https://firebase.google.com) (Auth, Firestore, Storage)                           |
| Fonts          | Inter (via `@expo-google-fonts/inter`)                                                       |
| Icons          | Ionicons, MaterialIcons (via [`@expo/vector-icons`](<(https://icons.expo.fyi)>))             |
| Image Picker   | [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)                  |
| Notifications  | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)               |
| State          | React Context (AuthContext, HabitContext)                                                    |
| Storage        | AsyncStorage (theme persistence)                                                             |
| Date Utilities | `date-fns`                                                                                   |

---

## 📁 Project Structure

```
mosaic/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Auth landing
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   ├── forgot-password.tsx
│   │   └── new-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tab navigator + FAB
│   │   ├── index.tsx               # Today / Home dashboard
│   │   ├── (habits)/
│   │   │   ├── index.tsx           # Manage habits list
│   │   │   ├── [habitId].tsx       # Habit detail screen
│   │   │   └── _layout.tsx
│   │   ├── profile.tsx
│   │   └── analytics.tsx
│   ├── add-habit.tsx               # Modal: create habit
│   ├── index.tsx                   # Root redirect
│   └── _layout.tsx                 # Root Stack navigator
├── components/
│   ├── analytics/                  # KpiCards, CompletionBarChart, HabitBreakdown
│   ├── auth/                       # AuthContainer, AuthDivider, AuthFooter
│   ├── habit/                      # ColorPicker, IconPicker, FrequencyPicker, GoalStepper
│   ├── home/                       # HabitCard, DailyProgressCard, ConsistencyHeatmap
│   ├── profile/                    # EditProfileModal, ConfirmPasswordModal
│   ├── settings/                   # SettingsSection, SettingsListItem, SettingsIconBox
│   └── ui/                         # Button, InputField, Input, SegmentedControl, SocialButton
├── context/
│   ├── AuthContext.tsx              # Firebase auth state + refreshUser
│   ├── HabitContext.tsx             # Real-time habits + completions + stats
│   └── LoaderContext.tsx            # Global loading overlay
├── hooks/
│   ├── useAuth.ts
│   └── useLoader.ts
├── services/
│   ├── firebaseConfig.ts            # Firebase app init
│   ├── authService.ts               # login, logout, deleteAccount
│   ├── HabitService.ts              # CRUD + real-time subscriptions
│   └── userService.ts               # Firestore user data, photo upload/remove
├── types/
│   └── index.ts                     # Habit, HabitCompletion, HabitStats types
└── global.css                       # NativeWind base styles
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Auth**, **Firestore**, and **Storage** enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/chanuthdewhan/mosaic-habit-tracker.git
cd mosaic

# Install dependencies
npm install

# Install Expo-specific packages
npx expo install expo-image-picker date-fns
```

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Create a **Firestore** database
4. Enable **Storage**
5. Copy your Firebase config into `services/firebaseConfig.ts`:

```ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase config values:

```bash
cp .env.example .env.local
```

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

> ⚠️ Never commit `.env` (local) to version control. It's already in `.gitignore` by default with Expo.

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /habits/{habitId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;
    }
    match /completions/{completionId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Security Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && fileName == request.auth.uid + '.jpg';
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Firestore Composite Indexes

Create these indexes in Firebase Console → Firestore → Indexes:

| Collection    | Fields                                         |
| ------------- | ---------------------------------------------- |
| `completions` | `habitId` ASC, `userId` ASC, `completedAt` ASC |
| `completions` | `userId` ASC, `completedAt` DESC               |
| `habits`      | `userId` ASC, `createdAt` DESC                 |

### Run the App

```bash
npx expo start
```

---

## 🔐 Authentication Flow

```
Sign Up → Firestore user doc created → Home
Sign In → Home
Forgot Password → Firebase reset email sent
Change Password → Re-authentication required (in-app)
Delete Account → Re-authentication + Firestore + Storage cleanup
```

---

## 📊 Data Model

### `habits/{habitId}`

```ts
{
  userId: string
  title: string
  description?: string
  icon: string          // key e.g. "water", "fitness"
  color: string         // hex e.g. "#f48c25"
  frequency: "daily" | "weekly" | "monthly"
  goal: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `completions/{completionId}`

```ts
{
  habitId: string
  userId: string
  completedAt: Timestamp
  note?: string
}
```

### `users/{userId}`

```ts
{
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Timestamp;
}
```

---

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.32",
  "expo-router": "~6.0.22",
  "expo-image-picker": "~17.0.10",
  "expo-haptics": "~15.0.8",
  "expo-linear-gradient": "~15.0.8",
  "expo-splash-screen": "~31.0.13",
  "nativewind": "^4.2.1",
  "tailwindcss": "^3.4.17",
  "firebase": "^12.9.0",
  "date-fns": "^4.1.0",
  "@expo-google-fonts/inter": "^0.4.2",
  "@expo/vector-icons": "^15.0.3",
  "react-native": "0.81.5",
  "react-native-safe-area-context": "5.4.0",
  "react-native-svg": "15.12.1",
  "react-native-reanimated": "~3.17.4",
  "react-native-gesture-handler": "~2.28.0",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

---

## 🗺 Roadmap

- [ ] Analytics wired to real Firestore data
- [ ] Habit detail screen with full stats
- [ ] Push notifications for daily reminders
- [ ] Export data as CSV
- [ ] Widget support (iOS / Android)
- [ ] Habit categories / tags
- [ ] Social sharing of streaks

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

MIT © 2026 Mosaic
