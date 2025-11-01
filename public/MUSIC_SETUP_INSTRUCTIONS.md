# Audio Setup Instructions

## Required Audio Files

To enable the audio features, you need to add audio files to the public folder.

### 1. Background Music

**File**: `kids-bg-music.mp3`

1. **Find or create a kid-friendly background music file** (mp3 format recommended)
   - Look for royalty-free children's music
   - Popular sources:
     - YouTube Audio Library (https://www.youtube.com/audiolibrary)
     - Free Music Archive (https://freemusicarchive.org)
     - Incompetech (https://incompetech.com)
     - Bensound (https://www.bensound.com)

2. **Name the file**: `kids-bg-music.mp3`

3. **Place it in this folder** (`public/`)

4. **Alternative**: If you want to use a different filename:
   - Edit `src/pages/user/LearningHubPage.vue`
   - Find the line: `bgMusicRef.value = new Audio('/kids-bg-music.mp3');`
   - Change `kids-bg-music.mp3` to your filename

### 2. Celebration Sound Effect

**File**: `celebration.mp3`

1. **Find or create a celebratory sound effect** (mp3 format recommended)
   - Short sound (1-3 seconds)
   - Fun, positive sounds like:
     - Cheering/applause
     - Bell chimes
     - Success jingle
     - "Yay!" or "Hooray!" sound
   - Popular sources:
     - Freesound (https://freesound.org)
     - Zapsplat (https://www.zapsplat.com)
     - Mixkit (https://mixkit.co/free-sound-effects/)

2. **Name the file**: `celebration.mp3`

3. **Place it in this folder** (`public/`)

4. **When it plays**: Automatically plays when a new word is added to the user's bucket

### Music Recommendations:
- Gentle, upbeat instrumental music
- No lyrics (to avoid distracting from learning)
- Loop-friendly (seamless when repeating)
- Length: 2-5 minutes works best
- Volume: The app defaults to 35% volume (adjustable by users)

### File Format:
- **Recommended**: MP3 (best browser compatibility)
- **Alternative**: OGG, WAV (larger file size)

---

## Music Recommendations:
- **Background Music**: Gentle, upbeat instrumental music
  - No lyrics (to avoid distracting from learning)
  - Loop-friendly (seamless when repeating)
  - Length: 2-5 minutes works best
  - Volume: The app defaults to 35% volume (adjustable by users)

- **Celebration Sound**: Short, positive sound effect
  - 1-3 seconds duration
  - Clear, cheerful sound
  - Not too loud or jarring
  - Volume: Set to 60% (hardcoded)

## File Format:
- **Recommended**: MP3 (best browser compatibility)
- **Alternative**: OGG, WAV (larger file size)

## Current Status:
⚠️ **Audio files needed**:
- `kids-bg-music.mp3` - Background music
- `celebration.mp3` - Celebration sound effect

---

## Features Once Enabled:

### Background Music:
- ▶️ Play/Pause button
- 🔉 Volume slider (0-100%)
- Default volume: 35%
- Auto-loop enabled
- User preferences saved in browser storage
- Auto-pauses during phonetics and word speech

### Celebration Sound:
- 🎉 Plays automatically when new word added to bucket
- Background music pauses during celebration
- Background music resumes after celebration
- Volume: 60%
