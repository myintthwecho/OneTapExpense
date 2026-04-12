# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Firebase Firestore rules

This project includes Firestore security rules in `firestore.rules` and index config in `firestore.indexes.json`.

### Deploy rules

```bash
firebase login
firebase use onetapexpense
firebase deploy --only firestore:rules,firestore:indexes
```

### Expected expense document path

`users/{uid}/expenses/{expenseId}`

### Required expense fields (rules-validated)

- `userId` (must match authenticated `uid`)
- `amount` (number, >= 0)
- `category` (non-empty string)
- `note` (string)
- `date` (non-empty string)
- `createdAt`
- `updatedAt`

## Account deletion request flow

The app now includes a `Request Account Deletion` action in Settings.

When a user submits a request, the app creates a Firestore document at:

`users/{uid}/deletionRequests/{requestId}`

With fields:

- `userId`
- `userEmail`
- `userDisplayName`
- `status` (`pending`)
- `source` (`mobile-app`)
- `createdAt`

### Admin processing (manual)

1. Open Firestore Console.
2. Check `users/{uid}/deletionRequests` for pending requests.
3. Delete user data (for example: `users/{uid}/expenses`).
4. Delete the Firebase Authentication user from Firebase Console.

### Optional email notifications

If you want an email whenever a request is created, use one of these options:

1. Firebase Extension `Trigger Email` plus a Cloud Function that mirrors each new deletion request into the extension's mail collection.
2. A Firebase Cloud Function that triggers on `users/{uid}/deletionRequests/{requestId}` and sends email with your preferred provider.
