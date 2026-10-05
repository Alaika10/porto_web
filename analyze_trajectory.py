import os
import cv2
import numpy as np

video_path = os.path.join("public", "Character.mp4")
cap = cv2.VideoCapture(video_path)

out_dir = os.path.join("scratch_frames")
os.makedirs(out_dir, exist_ok=True)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total frames to analyze: {total_frames}")

# Let's save a contact sheet or every 4th frame, plus inspect face features / optical flow / or dump every 4 frames
# 240 frames / 4 = 60 frames
for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    if i % 4 == 0 or i == total_frames - 1:
        # Save low-res preview or crop of head
        # Let's save a resized version to quickly review
        small = cv2.resize(frame, (320, 180))
        cv2.putText(small, f"F:{i}", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        cv2.imwrite(os.path.join(out_dir, f"frame_{i:03d}.jpg"), small)

cap.release()
print("Saved sample frames to scratch_frames")
