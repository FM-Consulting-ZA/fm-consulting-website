# FM Consulting: Brand films 02

Two original vertical films. Both are 1080 × 1920 at 30 fps, H.264 High with AAC 48 kHz, mixed to −16 LUFS / −1.5 dBTP, and both work with the sound off.

| | LEFT ON READ | APPLY TO BUY |
|---|---|---|
| Brief | "That is exactly the problem." | "That is a better way." |
| Length | 18.6 s | 17.3 s |
| Situation | A customer asks for a quote. The business answers two days later. | A customer taps "Get a quote" and gets 13 questions. |
| Mechanism | Empty space in the chat is waiting time. The camera travels through it, steps back, and the gap folds shut. | Every new question shoves the button further out of reach. The camera stays locked, and the objects stack, get struck out and fall. |
| FM's fix (as described in FM's own Insights articles) | Every enquiry gets an owner and a reply-by time. | Ask what starts the conversation and ask the rest on the call. |
| Closing line | **Don't buy more leads. Answer the ones you've got.** | **Stop making customers apply to buy from you.** |
| Cover | `FM_LeftOnRead_cover.png` | `FM_ApplyToBuy_cover.png` |

**What ties the two films together as one brand:**

- Both open on paper and close on ink.
- FM's diagnostic layer is set in Plex Mono throughout (dimension line, OWNER / REPLY TIME, QUESTIONS).
- The monogram appears at the exact moment of the fix, like initials on a correction.
- The object that proves the fix (the booking, the Sent button) grows into the end card.
- The same synthesised wooden *tock* marks FM's entrance and the lockup.

---

## Social captions

**LEFT ON READ**
> Two days to reply. They'd already booked someone else.
>
> Most businesses don't need more leads. They need someone to own the ones they already have. An enquiry sitting in a shared inbox isn't going cold. It's being left.
>
> FM Consulting fixes what happens between the enquiry and the sale. Every enquiry gets an owner and a reply time, and the leaks get found before more money goes into ads.
>
> Don't buy more leads. Answer the ones you've got.
>
> FM Consulting · Growth systems · Cape Town
> fmconsultingza.co.za

**APPLY TO BUY**
> Thirteen questions for a quote. The customer left at "Fax".
>
> Every field you add is one more reason to go and ask someone else. Ask what you need to start the conversation. Ask the rest on the call.
>
> FM Consulting finds where customers drop out between your ad and your sale, then fixes the path.
>
> Stop making customers apply to buy from you.
>
> FM Consulting · Growth systems · Cape Town
> fmconsultingza.co.za

The first line of each caption is the part that shows before "more". Each one names the situation in plain words, so someone scrolling with the sound off still gets the joke.

---

## What improved after the draft review

**LEFT ON READ**

1. **The payoff now has time to land.** In draft 1 the two-day gap closed in about 0.2 s, so you missed it if you blinked. The fold now takes 0.9 s: it starts slowly, then snaps shut with a firm latch. The REPLY TIME countdown also used to jump and bounce back to "6 MIN"; it now runs 2 DAYS, 47 HRS, and so on down to 5 MIN.
2. **Stepping back no longer turns the chat into a diagram.** The silence was 2,700 px of scroll, which forced the overview down to 34 % scale, where the messages were unreadable specks. At 1,700 px the overview sits at about 45 %, so "Hello?" and "found someone else" can still be read when FM steps back. As a side benefit, the scroll is slower and easier to read.
3. **Beats no longer collide.** The collapse and the zoom-in now happen one after the other instead of overlapping. The FM labels also clear before the conversation zooms over them; in draft 1, THANDI sat behind a chat bubble.
4. **Accuracy details are fixed.** The label now changes from NO REPLY to REPLIED AFTER once the business answers, and the header goes back to "online" when they reply. The countdown values were also shortened so they no longer run into the dimension line.

**APPLY TO BUY**

5. **The rewrite reads cleanly.** In draft 1, the strike line ran through "What do you need?" while it was being typed. Now the old question is struck, cleared, and then retyped.
6. **Small fixes to the sequence:**
   - The thumb no longer covers "Get a quote".
   - The three kept fields now draw above the falling ones.
   - The monogram-to-heading handover no longer ghosts.
   - "Fax" lands heavier, with a higher drop, more overshoot and a lower thud, so it reads as the last straw.

**Both films**

7. **Motion is clean.** In draft 1 the fast scrolls and zooms strobed into two or three ghost copies. Motion blur now adapts to speed (up to 12 samples per frame), so text smears smoothly and then settles sharp.
8. **The end card is legible on a phone.** The lockup went from 150 px to 250 px, so the wordmark's cap height went from 18 px to 30 px.
9. **The mix is cleaner.**
   - The eleven pen strikes now read as eleven separate strikes; before, they blurred into one wall of noise.
   - The clock ticks are rate-limited so they no longer turn into a buzz.
   - The end swell is 5 dB lower so the FM tock leads.
10. **Layout clears the platform UI.** The right margin is now 80 px so that Reels and TikTok buttons don't sit over message text.

Draft 1 of both films is in the source zip (`drafts/`) if you want to compare.

---

## Remaining limitations

- **I can't listen.** I checked the sound by measurement only (loudness, true peak, and spectrograms lined up against every cue). Please listen once on a phone speaker before posting.
- **No in-app test.** I haven't previewed the films inside Instagram or TikTok. All key copy sits between y 250 and 1480 and away from the right-hand button rail, but check once in each app's preview.
- **`yourbusiness.co.za` is a real, parked domain that is for sale.** It's shown as a generic placeholder. Swap it in `film2_apply_to_buy.js` if you'd rather not show it.
- **The chat and form interfaces are deliberately generic.** They use no WhatsApp green and no platform logos. That keeps the films on-brand and free of trademarks, at the cost of looking like "a messaging app" rather than a specific one.
- **Masters only.** You get 9:16 masters in H.264 8-bit. 4:5 and 1:1 cut-downs, a ProRes master and subtitles are not included, but all of them can be rendered from the source.
- **Names and numbers are fictional:** Thandi, Lebo, the masked phone number, the times. No results, statistics or testimonials are claimed.

## Tools, rights, costs

- **Tools:** Node with Skia (`@napi-rs/canvas`) for vector animation, FFmpeg for encoding and loudness, Python (NumPy/SciPy) for sound synthesis and QA. All of it ran in this session.
- **Brand assets:** the kit's own fonts (SIL OFL) and the unmodified logo SVGs.
  - Positive primary monogram on paper, above the 64 px minimum.
  - The supplied `-reverse` horizontal lockup with descriptor on ink, in Paper, with 2w clear space.
  - Type sizes are taken from the brand's modular scale × 2.5.
- **Sound:** 100 % synthesised in code, with no samples, stock or music, so nothing needs licensing.
- **Cost:** R0. No paid services were used.

## Files

- `FM_LeftOnRead_1080x1920.mp4`, `FM_ApplyToBuy_1080x1920.mp4`: the masters.
- `FM_*_cover.png`: covers. These are 1080 × 1920 with content dropped 120 px so they survive the 4:5 profile-grid crop.
- `FM_*_storyboard.png`: timed storyboards with action, on-screen copy and sound per beat.
- `style_frames/`: five style frames per film, rendered from the final code.
- `FM_Brand_Films_02_Source.zip`: editable source, cue sheets, stems, draft 1 renders and a README. `./build.sh` rebuilds everything, and `TL` at the top of each film file holds every beat in seconds.
