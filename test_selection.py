import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    frames.append(frame)
cap.release()

# Let's define the 8 keyframes:
# 0: UP: 44
# 8: UP_RIGHT: 64
# 16: RIGHT: 88
# 24: DOWN_RIGHT: 106
# 32: DOWN: 121
# 40: DOWN_LEFT: 144
# 48: LEFT: 161
# 56: UP_LEFT: 174
# 64: UP: 44

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

# For the sector 56 to 64:
# If we do frames:
# 56: 174
# 57: 175
# 58: 176
# 59: 177
# 60: 41
# 61: 42
# 62: 43
# 63: 44 (or 43.5)

selected_frames = []
for sec in range(7):
    start_slot, start_f = anchors[sec]
    end_slot, end_f = anchors[sec + 1]
    step = (end_f - start_f) / (end_slot - start_slot)
    for i in range(8):
        f = int(round(start_f + i * step))
        selected_frames.append(f)

# sector 7 (56 to 63)
# 174 -> 175 -> 176 -> 177 -> 41 -> 42 -> 43 -> 44 (wraps to 0 which is 44)
s7 = [174, 175, 176, 177, 41, 42, 43, 44]
for f in s7:
    selected_frames.append(f)

print(f"Total selected frames: {len(selected_frames)}")
for i, f in enumerate(selected_frames):
    print(f"Index {i:02d}: Frame {f}")

# Check step differences
diffs = []
for i in range(len(selected_frames)):
    next_i = (i + 1) % len(selected_frames)
    f1 = frames[selected_frames[i]]
    f2 = frames[selected_frames[next_i]]
    d = np.mean(cv2.absdiff(f1, f2))
    diffs.append(d)

print(f"Max diff between adjacent frames: {max(diffs):.2f} at index {np.argmax(diffs)}")
print(f"Mean diff: {np.mean(diffs):.2f}")
