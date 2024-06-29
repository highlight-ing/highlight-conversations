# highlight-conversations-app

Capture your conversations with transcripts and intelligence.

## Instructions

Run the following commands to get started:

```bash
npm install && npm run dev
```

### You'll need to be running the main Highlight app for this app to work.
### Make sure that `@highlight-ai/app-runtime` package is at least `0.0.23`
### Fetching transcripts have changed slightly with latest (06/27) build on highlight, will need to adjust in this app -- Auto clear conversations is set to minutes not specified days (for easier testing) if you see your cards disappear quickly

## Triage

### Must haves for release

- ~~Auto clear conversations~~
- ~~Mic activity feedback~~
- ~~Skeleton for incoming transcript~~
- ~~LocalStorage~~
- ~~Toggle for microphone superpower~~
- Prompt conversations (Julian is in progress)
- Modal Welcome screen (disablable, explain everything is local and private)
- ~~Figure out title of conversations~~
- Run app in background
- UI Cleanup:
  - ~~Current Conversation take width of grid (allows for easier reads of current conversation)~~
  - **HOLD** Smaller past conversation cards
  - Have grid of cards in defined scroll area
  - ~~Trashcan icon and delete conversation card~~
  - ~~Additional branding touchup (gradients, textures, etc...) (Jamie in progress)~~

### Nice to haves

- Tap to expand card to see full conversations (might be useless without topic/summary)
- End point to store session audio to do full retranscript for increased accuracy
- Tap to expand conversation
- Diarization (will require some UI to setup nicely, as well as fuller transcript per Karthick's explanation)
- Select Multiple Cards for deletion/sharing
- Sharing conversation (probably useless without topic and summary)
