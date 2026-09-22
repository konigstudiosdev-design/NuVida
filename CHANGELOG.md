# NuVida Release Changelog

## [1.0.0] - 2026-09-19 - Initial Production Launch Pilot 1.0

### Added
- **Multi-Tenant RBAC Security**: Bulletproof Firebase Firestore and Storage security rules enforcing `userId + organizationId + role + permission + resource ownership`.
- **Firebase Authentication**: Full production integration with Google OAuth, Email/Password, and Phone OTP.
- **Onboarding Wizard**: Step-by-step 3-step setup for new nutritionists to enter license number, specialty, clinic details, and PDF letterhead preferences.
- **Feature Flags Engine**: Dynamic control over AI Copilot, WhatsApp Business API, Patient Portal, Push Notifications, and Beta features.
- **Pilot Feedback Mechanism**: In-app feedback reporting for pilot dietitians and patients (`🐛 Bug`, `💡 Suggestion`, `❓ Help`, `⭐ Rating`).
- **Offline-First Outbox Queue**: Resilient offline patient creation, consultations, measurements, and payments with automatic sync upon reconnection.
- **Standalone PWA & Electron Desktop Wrapper**: Native experience on macOS, Windows, Android, and iOS.
