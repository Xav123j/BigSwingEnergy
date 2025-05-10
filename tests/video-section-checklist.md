# VideoSection Component Test Checklist

## Core Functionality Tests
1. **Desktop Split View**: Verify left column shows song list and right column shows thumbnails at ≥768px width.
2. **Mobile Drawer**: Confirm song list button appears at bottom and drawer slides up from bottom on mobile (<768px).
3. **Keyboard Navigation**: Test arrow keys (up/down) in song list for accessibility, Enter to play video.
4. **Audio Fade-out**: Ensure any background audio fades when video modal opens.
5. **Responsive Behavior**: Check that layout adapts correctly at various breakpoints (320px, 768px, 1024px, 1440px).
6. **Performance**: Run Lighthouse mobile test to ensure score ≥90 for performance, accessibility, and best practices.

## Specific Features to Test
- Video playback works in both modes (direct mp4 and YouTube embed)
- Drawer closes on swipe down and ESC key
- Gold left border appears on hover and selected state for song rows
- Focus trap works correctly in modal and drawer
- Thumbnails maintain correct aspect ratio
- Song list scrolls internally when it overflows
- ESC key closes video modal

## Browsers to Test
- Chrome latest
- Safari latest
- Firefox latest
- Mobile Safari (iOS)
- Chrome on Android 