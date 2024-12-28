# Datafast Developer Disabler

A Chrome extension that helps developers control Datafast Analytics tracking during development and testing.

## Installation

1. Download this repository as a ZIP file and extract it to a directory of your choosing.
2. Open Chrome/Arc and navigate to:
   - Chrome: `chrome://extensions`
   - Arc: `arc://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" button
5. ![image](https://github.com/user-attachments/assets/96af3ea7-5a51-4bf3-ac50-a9e66daf55df)
6. Select the directory containing the extension files

## Development Setup

The extension requires these files in the directory:
- manifest.json
- popup.html 
- popup.js
- background.js

## Usage

After installation:
1. Click the extension icon in your browser toolbar
2. Use the checkbox to toggle tracking for the current site
3. Enable "Enable by default for localhost" to automatically disable tracking on local environments
4. Add specific domains to always have tracking disabled
5. Remove domains from the disabled list when no longer needed

## How it Works

The extension manages the `datafast_ignore` flag in localStorage:
- When enabled: `localStorage.datafast_ignore = true`
- When disabled: Removes the flag from localStorage

This prevents Datafast Analytics from collecting data on specified sites and localhost environments.

## Learn More

Visit [Datafast Analytics](https://datafa.st/?via=ryan) to learn more about the analytics platform.
