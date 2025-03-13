# Twitch Panel Extension Template with Vite + Typescript + React

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Note: if you are in dark mode the text in the pages will be hard to see. I didn't apply styling.

This was created with the basic command:
`npm create vite@latest twitch-template -- --template react-ts`

There are 4 entry points:

- `config.html` - broadcaster configuration page.
- `live_config.html` - live config page launched from the dashboard.
- `panel.html` - the viewer panel below the stream.
- `mobile.html` - the mobile page but it points to the same tsx as the panel.html (easier to design one UI for both panel/mobile but you can split them up.)

There are two settings in the vite.config.ts that differ from the default project:

- `basicSsl()` which adds ssl to your local dev server.
  - You will need to open the page up and click "proceed anyway" or provide your own trusted cert/domain.
- Disabling module preloading
  - this breaks twitch because you're not allowed to load things before the helper is loaded.

This works in local testing and hosted testing using the defaults that twitch has setup for panel/mobile enabled extensions.

To test local:

- `npm run dev`

To deploy to hosted test:

- `npm run build`
- zip the contents of the dist folder (not the dist folder itself just everything inside it)
  - `cd dist`
  - `zip dist.zip * -r`
  - upload dist.zip to twitch
  - move to hosted test

## Wymagania systemowe

- Node.js 18 lub nowszy
- npm 9 lub nowszy
- Przeglądarka z obsługą WebGL

## Rozwój projektu

1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Uruchom serwer deweloperski: `npm run dev`
4. Otwórz `http://localhost:8083/panel.html` w przeglądarce

## Funkcje

1. Interaktywne fraktale z trybem medytacyjnym
2. Wizualizacja aktywności mózgu
3. Poziom magii i energii
4. Rytm 55.5 BPM dla relaksacji
5. Efekty świetlne i animacje
6. Tryb Grogu z magicznymi efektami
7. Responsywny interfejs
8. Wsparcie dla urządzeń mobilnych
9. Konfiguracja przez panel nadawcy
10. Integracja z Twitch

## Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT - zobacz plik [LICENSE](LICENSE) w głównym katalogu projektu.

## Autorzy

- **Adonai** - Główny programista i twórca projektu
- **SensAI Team** - Zespół odpowiedzialny za rozwój i utrzymanie projektu

W przypadku pytań lub sugestii, prosimy o kontakt przez:
- GitHub Issues
- Email: support@sensai.com
