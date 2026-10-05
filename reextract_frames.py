import os
import cv2
import numpy as np
from PIL import Image

video_path = os.path.join("public", "Character.mp4")
cap = cv2.VideoCapture(video_path)
frames = [cap.read()[1] for _ in range(240)]
cap.release()

# Compass directions:
# UP: 44
# UP_RIGHT: 64
# RIGHT: 88
# DOWN_RIGHT: 106
# DOWN: 121
# DOWN_LEFT: 144
# LEFT: 161
# UP_LEFT: 174

# Sector 0 (0..7): 44 -> 64 (8 steps)
# Sector 1 (8..15): 64 -> 88 (8 steps)
# Sector 2 (16..23): 88 -> 106 (8 steps)
# Sector 3 (24..31): 106 -> 121 (8 steps)
# Sector 4 (32..39): 121 -> 144 (8 steps)
# Sector 5 (40..47): 144 -> 161 (8 steps)
# Sector 6 (48..55): 161 -> 174 (8 steps)
# Sector 7 (56..63): 174 -> 185 -> 29 -> 44 (8 steps)

anchors = [
    (0, 44),
    (8, 64),
    (16, 88),
    (24, 106),
    (32, 121),
    (40, 144),
    (48, 161),
    (56, 174)
]

selected = []
for sec in range(7):
    start_slot, start_f = anchors[sec]
    end_slot, end_f = anchors[sec + 1]
    step = (end_f - start_f) / (end_slot - start_slot)
    for i in range(8):
        f = int(round(start_f + i * step))
        selected.append(f)

# Sector 7: 8 steps from 174 through 185 to 29 to 44
# 56: 174
# 57: 177
# 58: 180
# 59: 184
# 60: 29
# 61: 33
# 62: 37
# 63: 41
s7 = [174, 177, 180, 184, 29, 33, 37, 41]
for f in s7:
    selected.append(f)

assert len(selected) == 64

# Check diffs
diffs = []
for i in range(64):
    next_i = (i + 1) % 64
    d = np.mean(cv2.absdiff(frames[selected[i]], frames[selected[next_i]]))
    diffs.append(d)

print(f"Max diff: {max(diffs):.2f}, mean diff: {np.mean(diffs):.2f}")
for i in range(54, 64):
    print(f"Slot {i:02d}: Frame {selected[i]} -> next diff: {diffs[i]:.2f}")

# Export high quality WebP
out_dir = os.path.join("public", "frames")
os.makedirs(out_dir, exist_ok=True)
for i, f_num in enumerate(selected):
    frame_rgb = cv2.cvtColor(frames[f_num], cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame_rgb)
    img.save(os.path.join(out_dir, f"frame_{i:02d}.webp"), "WEBP", quality=92, method=6)

# Export center.webp
center_rgb = cv2.cvtColor(frames[204], cv2.COLOR_BGR2RGB)
center_img = Image.fromarray(center_rgb)
center_img.save(os.path.join("public", "center.webp"), "WEBP", quality=94, method=6)

print("Saved new 64 frames and center.webp with ultra-smooth bridge!")
