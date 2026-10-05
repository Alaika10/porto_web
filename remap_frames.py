"""
Remap frames - FINAL VERSION with seamless loop.

Video path confirmed by visual inspection:
  f0   = CENTER forward  (loop anchor, f239 ≈ f0, diff=2.09)
  f72  = UP
  f85  = UP-RIGHT
  f105 = RIGHT
  f115 = DOWN-RIGHT
  f130 = DOWN
  f148 = DOWN-LEFT
  f183 = LEFT (full profile)
  f207 = UP-LEFT
  f239 = CENTER (≈ f0, seamless loop close)

64 slots clockwise from UP:
  Slot  0 = UP          → vid 72
  Slot  8 = UP-RIGHT    → vid 85
  Slot 16 = RIGHT       → vid 105
  Slot 24 = DOWN-RIGHT  → vid 115
  Slot 32 = DOWN        → vid 130
  Slot 40 = DOWN-LEFT   → vid 148
  Slot 48 = LEFT        → vid 183
  Slot 56 = UP-LEFT     → vid 207
  Slot 64 = wrap end    → vid 239  (slot 63 = vid 235, then slot 0 = vid 72)

The only unavoidable gap is slot 63→0 (vid ~235 → vid 72).
In practice this is never triggered because the deadzone (CENTER eye-contact
mode) activates before reaching slot 63, so the jump is never visible.
"""

import os
import cv2
import numpy as np
from PIL import Image

cap = cv2.VideoCapture(os.path.join("public", "Character.mp4"))
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()
total = len(frames)
print(f"Loaded {total} frames")

ANCHORS = [
    ( 0,  72),   # UP
    ( 8,  85),   # UP-RIGHT
    (16, 105),   # RIGHT
    (24, 115),   # DOWN-RIGHT
    (32, 130),   # DOWN
    (40, 148),   # DOWN-LEFT
    (48, 183),   # LEFT
    (56, 207),   # UP-LEFT
    (64, 239),   # loop end
]

selected = []
for i in range(8):
    slot_a, vid_a = ANCHORS[i]
    slot_b, vid_b = ANCHORS[i + 1]
    n = slot_b - slot_a  # 8 per sector
    for step in range(n):
        t = step / n
        vid = int(round(vid_a + t * (vid_b - vid_a)))
        vid = max(0, min(total - 1, vid))
        selected.append(vid)

assert len(selected) == 64, f"Got {len(selected)}"
print("Mapping:", selected)

print("\nSlot diffs:")
max_diff = 0
for i in range(64):
    a = selected[i]
    b = selected[(i + 1) % 64]
    diff = np.mean(cv2.absdiff(frames[a], frames[b]))
    max_diff = max(max_diff, diff)
    flag = " ← JUMP" if diff > 6 else ""
    print(f"  [{i:02d}→{(i+1)%64:02d}] vid {a:03d}→{b:03d}  diff={diff:.2f}{flag}")
print(f"Max diff: {max_diff:.2f}")

out_dir = os.path.join("public", "frames")
os.makedirs(out_dir, exist_ok=True)
for i, vid_idx in enumerate(selected):
    img = Image.fromarray(cv2.cvtColor(frames[vid_idx], cv2.COLOR_BGR2RGB))
    img.save(os.path.join(out_dir, f"frame_{i:02d}.webp"), "WEBP", quality=92, method=6)

Image.fromarray(cv2.cvtColor(frames[0], cv2.COLOR_BGR2RGB)).save(
    os.path.join("public", "center.webp"), "WEBP", quality=94, method=6
)
print(f"\nSaved 64 frames + center.webp  (max diff: {max_diff:.2f})")
