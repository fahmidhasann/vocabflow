# Graph Report - .  (2026-04-11)

## Corpus Check
- Large corpus: 236 files · ~224,188 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 2142 nodes · 4699 edges · 109 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.8)
- Token cost: 9,950 input · 2,400 output

## God Nodes (most connected - your core abstractions)
1. `rf` - 72 edges
2. `e7()` - 60 edges
3. `i()` - 58 edges
4. `f()` - 46 edges
5. `eh` - 44 edges
6. `oD()` - 41 edges
7. `th` - 38 edges
8. `iu()` - 37 edges
9. `en` - 33 edges
10. `V()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `iOS Deep Link / OAuth Callback URL Handling` --conceptually_related_to--> `Auth OAuth Callback Page`  [INFERRED]
  ios/App/App/SceneDelegate.swift → android/app/src/main/assets/public/auth/callback.txt
- `iOS Next.js JS Chunk Build Artifacts` --implements--> `Next.js Static Export (Android Asset Bundle)`  [INFERRED]
  ios/App/App/public/_next/static/chunks/webpack-fc6437a0fdf5887f.js → android/app/src/main/assets/public/index.txt
- `Review Page (SRS Flashcard UI)` --conceptually_related_to--> `ReviewSessionState Type (state machine)`  [INFERRED]
  android/app/src/main/assets/public/review.txt → src/types/index.ts
- `CapacitorFilesystem Plugin` --rationale_for--> `Settings Page (JSON Export/Import)`  [INFERRED]
  ios/App/CapApp-SPM/Package.swift → android/app/src/main/assets/public/settings.txt
- `CapacitorShare Plugin` --rationale_for--> `Settings Page (JSON Export/Import)`  [INFERRED]
  ios/App/CapApp-SPM/Package.swift → android/app/src/main/assets/public/settings.txt

## Hyperedges (group relationships)
- **Capacitor Mobile Shell Architecture** — vocabflow_app, android_main_activity, capacitor_config, capacitor_bridge_activity, static_export_decision [EXTRACTED 1.00]
- **Native OAuth Flow** — platform_detector, auth_native, login_button, auth_callback_page [EXTRACTED 1.00]
- **Oxbridge Design Token System** — tailwind_config, globals_css, oxbridge_design_system [EXTRACTED 1.00]
- **Native Mobile OAuth Flow** — login_LoginButton, lib_platform, capacitor_Browser, lib_authNative, authcallback_AuthCallbackPage [EXTRACTED 0.95]
- **Dashboard Data Aggregation** — page_DashboardPage, hooks_useWords, hooks_useStreak, hooks_useStats [EXTRACTED 1.00]
- **Review Session Flow** — review_ReviewPage, hooks_useReviewSession, hooks_useWords, review_ReviewCard, review_RatingButtons, review_ReviewProgress, review_SessionSummary [EXTRACTED 1.00]
- **Add Word Flow (Lookup + UsageMap + Form)** — add_AddWordPage, hooks_useDictionaryLookup, hooks_useUsageMap, words_WordSearchInput, words_WordForm, words_UsageMapTree [EXTRACTED 1.00]
- **App Shell Composition** — layout_RootLayout, clientlayout_ClientLayout, ui_Toast, auth_AuthGuard, layout_Header, layout_BottomNav [EXTRACTED 1.00]
- **Settings Backup Export/Import Flow** — settings_SettingsPage, lib_backupTransfer, lib_platform, lib_supabaseClient, lib_supabaseMappers [EXTRACTED 1.00]
- **Review Session UI Flow** — ReviewCard, RatingButtons, ReviewProgress, SessionSummary [INFERRED 0.90]
- **Stats Display Components** — StatsOverview, StreakDisplay, LevelDistribution [INFERRED 0.85]
- **App Layout Shell Components** — Header, BottomNav, PageShell [INFERRED 0.85]
- **Supabase Data Access Hooks** — useWords, useStats, useStreak, useUser [EXTRACTED 1.00]
- **Client-Side Auth Guard Flow (Mobile+Web)** — AuthGuard, useUser, supabase_auth [EXTRACTED 1.00]
- **Usage Map Generation Pipeline** — useUsageMap, supabase_edge_fn_usage_map, UsageMapTree, WordDetail [EXTRACTED 1.00]
- **SRS Stage Visualization** — LevelDistribution, useStats, supabase_table_words [INFERRED 0.85]
- **Review Session State Machine (idle → showing-front → showing-back → complete)** — useReviewSession_hook, reviewSession_stateMachine, type_reviewSessionState [EXTRACTED 1.00]
- **SM-2 Algorithm Core Components** — srs_calculateNextReview, srs_sm2Algorithm, srs_easeFactor, srs_qualityMap, srs_getSrsStage [EXTRACTED 1.00]
- **Capacitor Backup Transfer (Filesystem + Share + FilePicker)** — backupTransfer_lib, capacitor_filesystem, capacitor_share, capawesome_filePicker [EXTRACTED 1.00]
- **Native Mobile OAuth Deep Link Flow** — authNative_lib, authNative_deepLink, authNative_pkceFlow, capacitor_app, capacitor_browser [EXTRACTED 1.00]
- **SRS Algorithm Test Coverage** — test_srs, srs_calculateNextReview, srs_getSrsStage, srs_previewIntervals, srs_formatInterval, srs_newWordSrsFields [EXTRACTED 1.00]
- **WordRow ↔ Word DB Mapping Layer** — mappers_wordRow, mappers_rowToWord, mappers_wordToInsert, mappers_wordToUpdate, type_word [EXTRACTED 1.00]
- **Usage Map AI Generation Pipeline (Groq + Edge Function)** — usageMap_edgeFunction, groq_api, usageMap_prompt [EXTRACTED 1.00]

## Communities

### Community 0 - "Supabase Client Bundle"
Cohesion: 0.02
Nodes (305): a1(), a2(), a3(), a4(), a5(), a6(), a7(), a9() (+297 more)

### Community 1 - "Supabase JS Core"
Cohesion: 0.02
Nodes (135): a(), c, catch(), cloneRequestState(), constructor(), copy(), createBucket(), createIndex() (+127 more)

### Community 2 - "React Framework Bundle"
Cohesion: 0.03
Nodes (216): A(), a1(), a2(), a3(), a4(), a5(), a6(), a7() (+208 more)

### Community 3 - "App Core + Android Shell"
Cohesion: 0.02
Nodes (19): Android Next.js Build Artifacts (JS chunks), OAuth Callback Page (client component), createBackupFilename(), decodeBase64Utf8(), downloadBackup(), exportBackup(), pickImportedBackupText(), Cordova.js Stub (Capacitor compat) (+11 more)

### Community 4 - "Token Refresh & Auth"
Cohesion: 0.05
Nodes (19): e7(), rf, rs(), ru, t_(), t1, tc(), td (+11 more)

### Community 5 - "Next.js Main Bundle"
Cohesion: 0.05
Nodes (28): a(), c, d, ea(), ec(), ef(), ei(), el() (+20 more)

### Community 6 - "Workbox PWA Cache"
Cohesion: 0.04
Nodes (27): a, b(), c(), d(), deleteCacheAndMetadata(), e(), et, f() (+19 more)

### Community 7 - "Supabase Realtime Channel"
Cohesion: 0.05
Nodes (7): eh, en, er(), es, getChannels(), _handleTokenChanged(), rD()

### Community 8 - "Mobile Native Features"
Cohesion: 0.03
Nodes (86): Deep Link OAuth Callback (appUrlOpen), PKCE Code Exchange Flow, setupNativeAuthListener Function, Backup Transfer Library, Next.js Build Manifest (EBewE_sZnbY2X5ULX6jyf), @capacitor/app Plugin, Capacitor ApplicationDelegateProxy, @capacitor/browser Plugin (+78 more)

### Community 9 - "React Error Boundaries"
Cohesion: 0.11
Nodes (23): A(), b(), C(), D(), E(), f, g(), h() (+15 more)

### Community 10 - "App Pages & Hooks"
Cohesion: 0.07
Nodes (48): AddWordPage, AuthGuard Component, AuthCallbackPage, Capacitor Browser Plugin, ClientLayout, useDebounce Hook, useDictionaryLookup Hook, useReviewSession Hook (+40 more)

### Community 11 - "iOS Capacitor Plugins (A)"
Cohesion: 0.08
Nodes (9): b(), c, E(), g, L, p(), v(), w (+1 more)

### Community 12 - "Android Capacitor Plugins"
Cohesion: 0.08
Nodes (9): b(), c, E(), g, L, p(), v(), w (+1 more)

### Community 13 - "UI Review Components"
Cohesion: 0.1
Nodes (29): AuthGuard Component, Header Component, LevelDistribution Component, RatingButtons Component, ReviewCard Component, ReviewProgress Component, SessionSummary Component, StatsOverview Component (+21 more)

### Community 14 - "iOS Settings Page Bundle"
Cohesion: 0.11
Nodes (6): b(), d(), f, g(), h(), i()

### Community 15 - "iOS Filesystem Plugin"
Cohesion: 0.21
Nodes (2): o(), s

### Community 16 - "Capacitor Status Bar"
Cohesion: 0.15
Nodes (15): a(), c(), d(), E(), f(), g, h, i() (+7 more)

### Community 17 - "Android Build Artifacts"
Cohesion: 0.09
Nodes (23): Android Next.js Build Artifacts, Shared Chunk 230, Shared Chunk 385, Shared Chunk 648, Shared Chunk 663, Shared Chunk fd9d1056, Next.js Framework Chunk, Main Chunk (+15 more)

### Community 18 - "UI Primitives"
Cohesion: 0.12
Nodes (23): Badge Component (SRS Stage Colors), BottomNav Component (Fixed, SVG Stroke Icons), Button Component (primary/secondary/ghost/danger), Card Component (Surface/Border/Shadow), Header Component (Sticky, Backdrop Blur), Modal Component (Warm Backdrop), RatingButtons Component (Again/Hard/Good/Easy), ReviewCard Component (Fade/Slide Reveal) (+15 more)

### Community 19 - "JS Polyfills"
Cohesion: 0.17
Nodes (7): e(), eb(), ib(), nb(), ob(), rb(), t()

### Community 20 - "Android Review Bundle"
Cohesion: 0.14
Nodes (2): i(), s()

### Community 21 - "Android Words Bundle"
Cohesion: 0.14
Nodes (0): 

### Community 22 - "iOS Review Bundle"
Cohesion: 0.16
Nodes (2): i(), s()

### Community 23 - "Android Words (Alt)"
Cohesion: 0.14
Nodes (0): 

### Community 24 - "Supabase Realtime Protocol"
Cohesion: 0.31
Nodes (1): z

### Community 25 - "iOS 503 Chunk"
Cohesion: 0.18
Nodes (3): l(), p(), s()

### Community 26 - "iOS Dashboard Bundle"
Cohesion: 0.15
Nodes (0): 

### Community 27 - "Android 503 Chunk"
Cohesion: 0.18
Nodes (3): f(), i(), l()

### Community 28 - "Android Dashboard Bundle"
Cohesion: 0.15
Nodes (0): 

### Community 29 - "iOS Build Artifacts"
Cohesion: 0.15
Nodes (13): React Framework Bundle, App Layout Bundle, Main Entry Bundle, Not Found Page Bundle, Add Word Page Bundle, Auth Callback Page Bundle, Review Page Bundle, Root Dashboard Page Bundle (+5 more)

### Community 30 - "iOS App Icon Design"
Cohesion: 0.23
Nodes (12): App Icon Purple Background Color, VocabFlow App Icon, White V Lettermark Logo, VocabFlow Brand Purple Color (~#4040D0), Oxbridge Design System Theme, Centered VocabFlow Logo on Splash Screen, Splash Screen Cream/Off-White Background (Light Mode), Splash Screen Dark Mode 1x (+4 more)

### Community 31 - "iOS App Layout Bundle"
Cohesion: 0.24
Nodes (4): c(), d(), o(), v()

### Community 32 - "Android App Layout Bundle"
Cohesion: 0.24
Nodes (4): c(), o(), u(), v()

### Community 33 - "iOS App Lifecycle"
Cohesion: 0.22
Nodes (5): AppDelegate, SceneDelegate, UIApplicationDelegate, UIResponder, UIWindowSceneDelegate

### Community 34 - "Brand Color System"
Cohesion: 0.33
Nodes (10): VocabFlow Brand Identity, Light Mode Splash Background (Warm Cream #F0EBE3), Dark Mode Splash Background (Near-Black #1A1410), Primary Indigo-Blue Color (#5B52EB), VocabFlow App Icon 192px (iOS App Bundle), VocabFlow PWA App Icon 192px (Web Public), VocabFlow App Icon 512px (iOS App Bundle), VocabFlow 'V' Lettermark (+2 more)

### Community 35 - "Capacitor App Plugin"
Cohesion: 0.22
Nodes (1): s

### Community 36 - "iOS Word Detail Bundle"
Cohesion: 0.25
Nodes (0): 

### Community 37 - "iOS Auth Callback Bundle"
Cohesion: 0.25
Nodes (0): 

### Community 38 - "iOS Stats Bundle"
Cohesion: 0.25
Nodes (0): 

### Community 39 - "iOS Settings Bundle"
Cohesion: 0.29
Nodes (2): l(), o()

### Community 40 - "Android Stats Bundle"
Cohesion: 0.25
Nodes (0): 

### Community 41 - "Android Adaptive Icons"
Cohesion: 0.5
Nodes (8): Android Adaptive Icon System, Android mdpi Screen Density, VocabFlow Brand Identity — V Logo, VocabFlow App Icon 512px (Public PWA), Android mdpi Adaptive Icon Background Layer, Android mdpi Adaptive Icon Foreground Layer, Android mdpi Round Launcher Icon, Android mdpi Standard Launcher Icon

### Community 42 - "Android Word Detail Bundle"
Cohesion: 0.29
Nodes (0): 

### Community 43 - "Backup Transfer"
Cohesion: 0.29
Nodes (7): exportBackup Function, pickImportedBackupText Function, Capacitor Core, @capacitor/filesystem Plugin, @capacitor/share Plugin, @capawesome/capacitor-file-picker Plugin, isNativePlatform Function

### Community 44 - "Service Worker"
Cohesion: 0.6
Nodes (4): a(), d(), n(), r()

### Community 45 - "Capacitor WebView Bridge"
Cohesion: 0.4
Nodes (1): o

### Community 46 - "Auth Middleware"
Cohesion: 0.4
Nodes (1): Client-side Auth Guard

### Community 47 - "Capacitor Share Plugin"
Cohesion: 0.5
Nodes (1): n

### Community 48 - "iOS Add Word Bundle"
Cohesion: 0.5
Nodes (0): 

### Community 49 - "iOS Login Bundle"
Cohesion: 0.5
Nodes (0): 

### Community 50 - "Android Add Word Bundle"
Cohesion: 0.5
Nodes (0): 

### Community 51 - "Capacitor 385 Chunk"
Cohesion: 0.67
Nodes (0): 

### Community 52 - "Android Instrumented Tests"
Cohesion: 0.67
Nodes (1): ExampleInstrumentedTest

### Community 53 - "Android Unit Tests"
Cohesion: 0.67
Nodes (1): ExampleUnitTest

### Community 54 - "Android Login Bundle"
Cohesion: 0.67
Nodes (0): 

### Community 55 - "Android Native Shell"
Cohesion: 0.67
Nodes (3): Android Instrumented Test, Android MainActivity, Capacitor BridgeActivity

### Community 56 - "SRS Algorithm"
Cohesion: 0.67
Nodes (2): SM-2 Spaced Repetition Algorithm, SRS Library (srs.ts)

### Community 57 - "Dictionary Search"
Cohesion: 0.67
Nodes (3): WordSearchInput Component, Dictionary API Library, useDictionaryLookup Hook

### Community 58 - "AI Usage Map (Groq)"
Cohesion: 0.67
Nodes (3): Groq API (llama-3.3-70b-versatile), Usage Map Supabase Edge Function, Usage Map AI Prompt (Semantic Domains)

### Community 59 - "iOS Webpack Bundle"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Not Found Page"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Android MainActivity"
Cohesion: 1.0
Nodes (1): MainActivity

### Community 62 - "Android Webpack Bundle"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Usage Map Hook & Edge Function"
Cohesion: 1.0
Nodes (2): Supabase Edge Function: usage-map, useUsageMap Hook

### Community 64 - "PWA Service Worker"
Cohesion: 1.0
Nodes (2): Service Worker (sw.js), Workbox Library (build artifact)

### Community 65 - "Theme System"
Cohesion: 1.0
Nodes (2): useTheme Hook, ThemeToggle UI Component

### Community 66 - "Utility Functions"
Cohesion: 1.0
Nodes (2): Utils Test Suite, Utility Functions Library

### Community 67 - "Dictionary API"
Cohesion: 1.0
Nodes (2): Dictionary API Base URL, lookupWord Function

### Community 68 - "Backup Transfer Tests"
Cohesion: 1.0
Nodes (2): createBackupFilename Function, Backup Transfer Test Suite

### Community 69 - "Android App Icons"
Cohesion: 1.0
Nodes (2): VocabFlow Android Launcher Icon — adaptive icon design, Android Splash Screens — all density and orientation variants

### Community 70 - "Next.js Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 71 - "Cordova Bridge"
Cohesion: 1.0
Nodes (0): 

### Community 72 - "Cordova Plugins Registry"
Cohesion: 1.0
Nodes (0): 

### Community 73 - "Main App Entry"
Cohesion: 1.0
Nodes (0): 

### Community 74 - "Capacitor 90 Chunk"
Cohesion: 1.0
Nodes (0): 

### Community 75 - "Capacitor 663 Chunk"
Cohesion: 1.0
Nodes (0): 

### Community 76 - "Pages App Bundle"
Cohesion: 1.0
Nodes (0): 

### Community 77 - "Error Page Bundle"
Cohesion: 1.0
Nodes (0): 

### Community 78 - "SSG Manifest"
Cohesion: 1.0
Nodes (0): 

### Community 79 - "Build Manifest"
Cohesion: 1.0
Nodes (0): 

### Community 80 - "Package Config"
Cohesion: 1.0
Nodes (0): 

### Community 81 - "iOS SPM Package"
Cohesion: 1.0
Nodes (0): 

### Community 82 - "App Index"
Cohesion: 1.0
Nodes (0): 

### Community 83 - "Database Layer"
Cohesion: 1.0
Nodes (0): 

### Community 84 - "Next.js Env"
Cohesion: 1.0
Nodes (1): Next.js TypeScript Environment Declaration

### Community 85 - "Android Unit Test"
Cohesion: 1.0
Nodes (1): Android Unit Test

### Community 86 - "AppState Type"
Cohesion: 1.0
Nodes (1): AppState Type (key-value store)

### Community 87 - "DictionaryResponse Type"
Cohesion: 1.0
Nodes (1): DictionaryResponse Type

### Community 88 - "Dashboard Page"
Cohesion: 1.0
Nodes (1): Dashboard Page (/)

### Community 89 - "Bottom Navigation"
Cohesion: 1.0
Nodes (1): BottomNav Component

### Community 90 - "Page Shell Layout"
Cohesion: 1.0
Nodes (1): PageShell Layout Component

### Community 91 - "useDebounce Hook"
Cohesion: 1.0
Nodes (1): useDebounce Hook

### Community 92 - "Platform Detection"
Cohesion: 1.0
Nodes (1): Platform Detection Library

### Community 93 - "App Constants"
Cohesion: 1.0
Nodes (1): App Constants

### Community 94 - "Dictionary API Lib"
Cohesion: 1.0
Nodes (1): Dictionary API Library

### Community 95 - "Events System"
Cohesion: 1.0
Nodes (1): Custom Event Bus

### Community 96 - "Native Auth Lib"
Cohesion: 1.0
Nodes (1): Native Auth Library

### Community 97 - "Native Auth Teardown"
Cohesion: 1.0
Nodes (1): teardownNativeAuthListener Function

### Community 98 - "Backup Transfer Payload"
Cohesion: 1.0
Nodes (1): BackupPayload Interface

### Community 99 - "DB Mappers"
Cohesion: 1.0
Nodes (1): Supabase Mappers

### Community 100 - "Android Resources (xxhdpi)"
Cohesion: 1.0
Nodes (1): Android Launcher Icons hdpi + splash land-night variants

### Community 101 - "Android Resources (ldpi)"
Cohesion: 1.0
Nodes (1): Android Splash night + ldpi launcher icons

### Community 102 - "Android Resources (xxxhdpi)"
Cohesion: 1.0
Nodes (1): Android ldpi launcher + default splash + xxxhdpi launcher

### Community 103 - "Android Resources (land-night)"
Cohesion: 1.0
Nodes (1): Android xxxhdpi + xxhdpi launcher icons

### Community 104 - "Android Resources (xxhdpi-b)"
Cohesion: 1.0
Nodes (1): Android xxhdpi launcher icons + port-ldpi splash

### Community 105 - "Android Resources (port-hdpi)"
Cohesion: 1.0
Nodes (1): Android splash port/land hdpi/mdpi variants

### Community 106 - "Android Resources (land-hdpi)"
Cohesion: 1.0
Nodes (1): Android splash land variants + xhdpi launcher

### Community 107 - "Android Resources (xhdpi)"
Cohesion: 1.0
Nodes (1): Android xhdpi launcher + xxxhdpi night splash

### Community 108 - "Android Resources (xxxhdpi-land)"
Cohesion: 1.0
Nodes (1): Android xxxhdpi splash + app icons

## Ambiguous Edges - Review These
- `useTheme Hook` → `Supabase Client Factory`  [AMBIGUOUS]
  src/hooks/useTheme.ts · relation: references

## Knowledge Gaps
- **157 isolated node(s):** `t5`, `h`, `MainActivity`, `Next.js TypeScript Environment Declaration`, `Capacitor BridgeActivity` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `iOS Webpack Bundle`** (2 nodes): `webpack-fc6437a0fdf5887f.js`, `d()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Not Found Page`** (2 nodes): `page-49bbbd67188fea53.js`, `s()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android MainActivity`** (2 nodes): `MainActivity.java`, `MainActivity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Webpack Bundle`** (2 nodes): `webpack-70bda22133581eba.js`, `d()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Usage Map Hook & Edge Function`** (2 nodes): `Supabase Edge Function: usage-map`, `useUsageMap Hook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PWA Service Worker`** (2 nodes): `Service Worker (sw.js)`, `Workbox Library (build artifact)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme System`** (2 nodes): `useTheme Hook`, `ThemeToggle UI Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Utility Functions`** (2 nodes): `Utils Test Suite`, `Utility Functions Library`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dictionary API`** (2 nodes): `Dictionary API Base URL`, `lookupWord Function`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backup Transfer Tests`** (2 nodes): `createBackupFilename Function`, `Backup Transfer Test Suite`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android App Icons`** (2 nodes): `VocabFlow Android Launcher Icon — adaptive icon design`, `Android Splash Screens — all density and orientation variants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Definitions`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cordova Bridge`** (1 nodes): `cordova.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cordova Plugins Registry`** (1 nodes): `cordova_plugins.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Main App Entry`** (1 nodes): `main-app-8cab2002b9c0dc0a.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Capacitor 90 Chunk`** (1 nodes): `90.893810107471e296.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Capacitor 663 Chunk`** (1 nodes): `663.23f9e01d50e58ec4.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pages App Bundle`** (1 nodes): `_app-72b849fbd24ac258.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Error Page Bundle`** (1 nodes): `_error-7ba65e1336b92748.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SSG Manifest`** (1 nodes): `_ssgManifest.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Build Manifest`** (1 nodes): `_buildManifest.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Package Config`** (1 nodes): `Package.swift`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `iOS SPM Package`** (1 nodes): `CapApp-SPM.swift`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Layer`** (1 nodes): `db.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Env`** (1 nodes): `Next.js TypeScript Environment Declaration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Unit Test`** (1 nodes): `Android Unit Test`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppState Type`** (1 nodes): `AppState Type (key-value store)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DictionaryResponse Type`** (1 nodes): `DictionaryResponse Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Page`** (1 nodes): `Dashboard Page (/)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bottom Navigation`** (1 nodes): `BottomNav Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Page Shell Layout`** (1 nodes): `PageShell Layout Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useDebounce Hook`** (1 nodes): `useDebounce Hook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Platform Detection`** (1 nodes): `Platform Detection Library`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Constants`** (1 nodes): `App Constants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dictionary API Lib`** (1 nodes): `Dictionary API Library`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Events System`** (1 nodes): `Custom Event Bus`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Native Auth Lib`** (1 nodes): `Native Auth Library`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Native Auth Teardown`** (1 nodes): `teardownNativeAuthListener Function`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backup Transfer Payload`** (1 nodes): `BackupPayload Interface`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DB Mappers`** (1 nodes): `Supabase Mappers`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (xxhdpi)`** (1 nodes): `Android Launcher Icons hdpi + splash land-night variants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (ldpi)`** (1 nodes): `Android Splash night + ldpi launcher icons`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (xxxhdpi)`** (1 nodes): `Android ldpi launcher + default splash + xxxhdpi launcher`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (land-night)`** (1 nodes): `Android xxxhdpi + xxhdpi launcher icons`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (xxhdpi-b)`** (1 nodes): `Android xxhdpi launcher icons + port-ldpi splash`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (port-hdpi)`** (1 nodes): `Android splash port/land hdpi/mdpi variants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (land-hdpi)`** (1 nodes): `Android splash land variants + xhdpi launcher`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (xhdpi)`** (1 nodes): `Android xhdpi launcher + xxxhdpi night splash`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Resources (xxxhdpi-land)`** (1 nodes): `Android xxxhdpi splash + app icons`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `useTheme Hook` and `Supabase Client Factory`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `rf` connect `Token Refresh & Auth` to `Supabase JS Core`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `eh` connect `Supabase Realtime Channel` to `Supabase Realtime Protocol`, `Supabase JS Core`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `t5`, `h`, `MainActivity` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Supabase Client Bundle` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Supabase JS Core` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `React Framework Bundle` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._