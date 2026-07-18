# Moonlit Tales (Expo)

Faithful React Native port of the Moonlit Tales web app.

## Run (JS only / Expo Go)

```bash
cd mobile
npm start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with Expo Go.

> Custom native modules (dev client, speech, etc.) need a **development build** — see EAS below. Expo Go alone is not enough for day-to-day native work once you rely on those.

## EAS Build profiles

| Profile | When to use | Script |
| --- | --- | --- |
| **development** | Your device/emulator with the Expo dev client — rebuild after native dependency changes | `npm run build:dev` |
| **preview** | Internal testers / beta (APK, internal distribution, `preview` channel) | `npm run build:preview` |
| **production** | Store submission (AAB on Android, auto-increment, `production` channel) | `npm run build:prod` |

Everyday loop after you have a development build installed:

1. `npm run build:dev` — once (or whenever native deps / plugins change)
2. Install the resulting APK / TestFlight build on your device
3. `npm run start:dev` — Metro with `--dev-client` for normal JS iteration

Project on EAS: [@ak45h6017/moonlit-tales](https://expo.dev/accounts/ak45h6017/projects/moonlit-tales)  
App IDs: `in.redevolve.moonlittales` (Android package + iOS bundle identifier)

## Structure

- `app/index.tsx` — Create Story (night theme)
- `app/read/[storyId].tsx` — Story Reading (paper theme)
- `lib/stories.ts` — types, seed stories, `getEveningGreeting`
- `lib/generate.ts` — POST to web `/api/generate-story`
- `lib/store.ts` — AsyncStorage-backed library (zustand)
- `lib/device.ts` — device UUID session
- `assets/animations/` — baby splash + loading Lottie files

## Story generation API

The app POSTs to `/api/generate-story` on your TanStack Start deployment.

Set in the Expo environment (or `.env`):

```
EXPO_PUBLIC_API_URL=https://your-deployed-web-app.example.com
```

Do not put `OPENAI_API_KEY` in the mobile env — it stays server-only on the web host.
