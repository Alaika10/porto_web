import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = [cap.read()[1] for _ in range(240)]
cap.release()

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

selected_frames = []
for sec in range(7):
    start_slot, start_f = anchors[sec]
    end_slot, end_f = anchors[sec + 1]
    step = (end_f - start_f) / (end_slot - start_slot)
    for i in range(8):
        f = int(round(start_f + i * step))
        selected_frames.append(f)

# sector 7 (56 to 63)
s7 = [174, 175, 176, 177, 41, 42, 43, 44]
for f in s7:
    selected_frames.append(f)

# Write to an mp4 test video at 30fps
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter("scratch_frames/rotation_test.mp4", fourcc, 30.0, (1280, 720))

for loop in range(3): # 3 rotations
    for f_idx in selected_frames:
        out.write(frames[f_idx])

out.release()
print("Saved scratch_frames/rotation_test.mp4")
