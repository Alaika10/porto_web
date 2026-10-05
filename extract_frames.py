import os
import cv2
import numpy as np
from PIL import Image

video_path = os.path.join("public", "Character.mp4")
if not os.path.exists(video_path):
    video_path = os.path.join("public", "character.mp4")

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)

print(f"Loaded video: {video_path} ({total_frames} frames @ {fps} fps)")

frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    frames.append(frame)
cap.release()

# 8 Compass Directions & Center
COMPASS_FRAMES = {
    "UP": 44,
    "UP_RIGHT": 64,
    "RIGHT": 88,
    "DOWN_RIGHT": 106,
    "DOWN": 121,
    "DOWN_LEFT": 144,
    "LEFT": 161,
    "UP_LEFT": 174,
    "CENTER": 204
}

print("\n--- COMPASS DIRECTION IDENTIFIED FRAMES ---")
for direction, f_num in COMPASS_FRAMES.items():
    print(f"{direction:12s}: Frame {f_num}")

# Build 64 frames along 360-degree trajectory:
# Sector 0 (0..7): 44 to 64
# Sector 1 (8..15): 64 to 88
# Sector 2 (16..23): 88 to 106
# Sector 3 (24..31): 106 to 121
# Sector 4 (32..39): 121 to 144
# Sector 5 (40..47): 144 to 161
# Sector 6 (48..55): 161 to 174
# Sector 7 (56..63): 174 to 44

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

selected_indices = []
for sec in range(7):
    start_slot, start_f = anchors[sec]
    end_slot, end_f = anchors[sec + 1]
    step = (end_f - start_f) / (end_slot - start_slot)
    for i in range(8):
        f = int(round(start_f + i * step))
        selected_indices.append(f)

# Sector 7: 174 -> 175 -> 176 -> 177 -> 41 -> 42 -> 43 -> 44
s7 = [174, 175, 176, 177, 41, 42, 43, 44]
for f in s7:
    selected_indices.append(f)

assert len(selected_indices) == 64, f"Expected 64 frames, got {len(selected_indices)}"

output_dir = os.path.join("public", "frames")
os.makedirs(output_dir, exist_ok=True)

# Save WebP frames
print(f"\nExtracting 64 WebP frames to {output_dir}...")
for i, f_idx in enumerate(selected_indices):
    frame_bgr = frames[f_idx]
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(frame_rgb)
    out_path = os.path.join(output_dir, f"frame_{i:02d}.webp")
    # Save with high quality WebP
    pil_img.save(out_path, "WEBP", quality=90, method=6)

# Save center.webp
center_bgr = frames[COMPASS_FRAMES["CENTER"]]
center_rgb = cv2.cvtColor(center_bgr, cv2.COLOR_BGR2RGB)
center_img = Image.fromarray(center_rgb)
center_path = os.path.join("public", "center.webp")
center_img.save(center_path, "WEBP", quality=92, method=6)

print(f"Saved {center_path}")
print(f"Successfully pre-extracted all 64 trajectory frames and center.webp!")
