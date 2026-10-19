# FM Consulting — Brand films: PLUMB & SHORTCUT

Two original vertical films (1080 × 1920, 30 fps, H.264 + AAC 48 kHz). Both play fully with sound off.

| | PLUMB | SHORTCUT |
|---|---|---|
| Ambition | Astonishment through perception | Audacity through visual wit |
| Length | 17.4 s | 15.8 s |
| On-screen line | *It was never the line.* | *The road was a suggestion.* |
| Loudness | −17.4 LUFS · −1.5 dBTP | −16.2 LUFS · −1.5 dBTP |
| Cover | `FM_Plumb_cover.png` | `FM_Shortcut_cover.png` |

*For public use, consider calling SHORTCUT "Fold" or "0.0 km". "Shortcut" can read as cutting corners.*

---

## Social captions

**PLUMB**
> Watch the line.
> Independent judgement for businesses that can't afford to drift.
> FM Consulting · Growth Systems · Cape Town

**SHORTCUT**
> The road is one option.
> Senior thinking that finds the shorter route, then takes it.
> FM Consulting · Growth Systems · Cape Town

The first line of each caption is the only part visible before "more". "Watch the line." points attention at the bar before the film pulls the rug. The film's own line then pays it off.

---

## The two films in one paragraph each

**PLUMB.** A heavy bar in the exact proportions of the FM spine swings from a thread above three rolling balls. An instrument readout at top right says *LINE 0.0°*. One ball teeters, then tips over the edge in slow motion. At the bottom of its next swing the bar stops dead at vertical. Time all but holds and the sound cuts out, while the room keeps going. A second readout arrives, *ROOM −17.8°*, and we pull back: the room, a paper panel in the ink, was rocking the whole time. The ROOM figure counts down to 0.0° as it settles, and the card reads *"It was never the line."* The room opens up, the bar becomes the spine of the mark with the thread running through the head's aperture, and *TRUE 0.0°* sits under the lockup.

**SHORTCUT.** A small disc drives a mountain road, hairpin after hairpin, while a taxi-style meter ticks down from 3.2 KM. It stops at 2.0 KM, creeps forward, thinks better of it, and measures the straight line to the summit (0.3 KM). A second dashed line bisects that one at a right angle, and the paper folds along it. The summit lands exactly on the disc and the meter reads 0.0 KM. The sheet unfolds with the disc now at the top. *"The road was a suggestion."* appears on the meter's baseline, set the way a map sets its labels: the road is knocked out behind the words. We pull back: the whole map, one crease, sits on ink above the reversed lockup.

**Why they're FM's:** the manual says the spine is "the only part that should never move". PLUMB makes that literal, and the bar we thought was swinging *is* the spine. SHORTCUT uses the brand's only two materials, ink and paper, and paper's one real property, that it folds, to show seeing a possibility that isn't on the map.

---

## Revision 2: comprehension pass (after client review)

The concern was that viewers might not get the point on first viewing, PLUMB especially. The changes:

**PLUMB**
1. **The opening readout is now the hook.** "TRUE 0.0°" became *LINE 0.0°* at about twice the size, as a screen-fixed instrument (top right, 58 px, in the same style as Shortcut's meter). A visibly swinging bar labelled 0.0° is a contradiction people notice.
2. **The mechanism is named at the moment of discovery.** *ROOM* appears the instant the bar stops and shows the room's real tilt, counting down to 0.0° as it settles. The digits update at 15 Hz, like a real instrument, so they stay crisp under motion blur. Each glyph is ink over the paper and paper over the ink, so the readout stays legible as the room swings under it.
3. **The swap is held.** Time drops to about 10% on the exact frame the bar reaches vertical, and the sound cuts to near-silence on that frame for about 0.4 s, then returns with the sub swell as the room is revealed.
4. **The line.** *"It was never the line."* is set in Archivo on the card once the room is level, held for about 1.4 s. *TRUE 0.0°* remains under the lockup as the sign-off.
5. **The wordmark now fades in only once the lockup fits the frame.** Previously it was briefly cropped during the zoom.

**SHORTCUT**
1. **The line.** *"The road was a suggestion."* sits bottom left on the same baseline as 0.0 KM after the unfold. A paper halo interrupts the road behind the type, so the line visibly breaks the road it's talking about.
2. **The beat and its sound are extended by 0.8 s** so the line can be read, then it fades with the meter as the camera pulls back.

---

## What improved after the first draft review

**PLUMB:** the opening now starts further into the swing, so the event lands about 1.5 s sooner. The ball pivots over the lip (it teeters, then tips) instead of sliding off. The reveal is timed to the swing's zero-crossing. The wide shot is larger and tighter. Ambience is down about 10 dB, and the sign-off *tock* lands on the frame the mark appears.

**SHORTCUT:** the fold is readable in the air (it used to be a two-frame flash). The film has motion from frame 1 and a tighter decision beat. A one-frame pop at the unfold is fixed, as is line ghosting on the fast moves. The ticks are quieter so the landing thump carries the joke. The new pull-back ending shows the creased map as an object on ink.

---

## Tools, rights, costs

- **Tools used:** Node + Skia (`@napi-rs/canvas`) for vector animation, FFmpeg for encoding, Python (NumPy/SciPy) for sound synthesis and QA. All of it ran in this session.
- **Brand assets:** the kit's own fonts (SIL OFL) and unmodified logo SVGs. Positive art is used on paper and the supplied `-reverse` art on ink.
- **Sound:** 100% synthesised from code. There are no samples, stock libraries or music, so there are no licence fees and nothing to clear.
- **Costs incurred:** none. No external services were used. The Fable-model reviewer I tried for a blind test returned "out of usage credits", so I didn't use it.
- **Optional extras, not bought:** licensed music, a commissioned composer, or a voice-over would all cost extra. I'll price options first if you want any.

## Source

`FM_Brand_Films_Source.zip` contains the render code, the sound synthesis, the brand assets, the cue data, the audio mixes and `build.sh`. The README explains how to retime a beat or rebuild everything.
