# Mobile Video System Implementation

## Overview

This document outlines the implementation of a two-video sequence system for mobile devices, enhancing the existing video workflow to support seamless transitions between `mobil_anim.mp4` and `intro_mobile.mp4`.

## Current Video Workflow Analysis

### Desktop Behavior

- **Fresh Load**: Show "Dive In" button → Play intro video → Show content with looping
- **SPA Navigation**: Jump to specific time in video → Continue playing with loop

### Mobile Behavior (Current)

- **All Navigation**: Direct play of `intro_mobile.mp4` → Show content with looping

## New Mobile Video System

### Requirements

1. **Fresh Load Sequence**:
   - Play `mobil_anim.mp4` first
   - Seamlessly transition to `intro_mobile.mp4`
   - Loop `intro_mobile.mp4` indefinitely
2. **SPA Navigation**:
   - Skip `mobil_anim.mp4`
   - Play only `intro_mobile.mp4`
   - Loop `intro_mobile.mp4` indefinitely

### Architecture Design

#### Hook Structure

```
useVideoWorkflow (orchestrator)
├── useDesktopVideoWorkflow (extracted from current)
└── useMobileVideoSequence (new mobile logic)
```

#### Mobile Video States

- `"loading"` - Initial state, videos loading
- `"playing-mobile-anim"` - Playing mobil_anim.mp4 (fresh load only)
- `"transitioning"` - Switching from mobil_anim to intro_mobile
- `"playing-intro"` - Playing intro_mobile.mp4
- `"looping"` - Looping intro_mobile.mp4

#### Video Source Resolution

```typescript
// Fresh load sequence
1. mobil_anim.mp4 (until ended)
2. intro_mobile.mp4 (loop from start)

// SPA navigation
1. intro_mobile.mp4 (loop from start)
```

## Implementation Plan

### Phase 1: Architecture Restructuring

1. **Extract Desktop Logic**
   - Create `useDesktopVideoWorkflow.ts` from current `useVideoWorkflow.ts`
   - Remove all mobile-specific logic
   - Keep desktop workflow intact

2. **Create Mobile Hook**
   - Implement `useMobileVideoSequence.ts`
   - Handle two-video sequence logic
   - Manage mobile-specific states

3. **Orchestrator Hook**
   - Create new `useVideoWorkflow.ts` as device detector
   - Delegate to appropriate workflow based on `isMobile()`
   - Maintain consistent interface for components

### Phase 2: Mobile Sequence Logic

#### Video Sequence Manager

```typescript
interface MobileVideoSequence {
  currentVideo: "mobil_anim" | "intro_mobile";
  currentSrc: string;
  shouldTransition: boolean;
  sequenceState: MobileVideoState;
}
```

#### Transition Handling

- Monitor `mobil_anim.mp4` ended event
- Seamlessly switch to `intro_mobile.mp4`
- Handle video loading states during transition
- Implement loop logic for `intro_mobile.mp4`

### Phase 3: Component Integration

#### VideoBackground Updates

- Support dynamic video source changes
- Handle video switching without visual interruption
- Maintain existing event handlers

#### Configuration Updates

- Add mobile animation duration to config
- Configure transition timing
- Set loop start points for mobile videos

## Technical Considerations

### Seamless Video Transition

- Preload `intro_mobile.mp4` while `mobil_anim.mp4` is playing
- Use video element swap technique or source switching
- Minimize visual interruption during transition

### Performance

- Efficient video preloading strategy
- Memory management for multiple video sources
- Optimize for mobile device constraints

### Error Handling

- Fallback to `intro_mobile.mp4` if `mobil_anim.mp4` fails
- Graceful degradation for unsupported devices
- Network error recovery

## Files Modified

### New Files

- `src/hooks/useDesktopVideoWorkflow.ts` - Extracted desktop logic
- `src/hooks/useMobileVideoSequence.ts` - Mobile video sequence logic

### Modified Files

- `src/hooks/useVideoWorkflow.ts` - Orchestrator hook
- `src/component/pages/HomeContainer.tsx` - Updated imports
- `src/component/layout/VideoBackground.tsx` - Mobile sequence support
- `src/config/videoTransitionConfig.ts` - Mobile configuration

## Testing Strategy

### Mobile Sequence Testing

1. **Fresh Load**: Verify `mobil_anim.mp4` → `intro_mobile.mp4` → loop
2. **SPA Navigation**: Verify direct `intro_mobile.mp4` → loop
3. **Transition Smoothness**: No visual glitches during video switch
4. **Error Scenarios**: Fallback behavior when videos fail to load

### Cross-Device Testing

- Ensure desktop workflow remains unchanged
- Test mobile detection accuracy
- Verify responsive behavior

## Configuration

### Video Transition Config

```typescript
mobile: {
  muted: true,
  animationDuration: 2.5, // mobil_anim.mp4 duration
  introLoopStart: 0, // intro_mobile.mp4 loop start
  enableAnimation: true // flag to enable/disable sequence
}
```

## Future Enhancements

### Potential Improvements

- Audio synchronization between videos
- Custom loading indicators for mobile sequence
- Analytics tracking for mobile video engagement
- Progressive video quality based on connection

### Accessibility

- Video descriptions for screen readers
- Reduced motion preferences support
- Keyboard navigation compatibility

---

_Implementation Date: September 2025_
_Status: In Progress_

