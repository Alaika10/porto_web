import os
import cv2
import numpy as np

# Create a montage of frames
# 60 sample frames (0, 4, 8, ..., 236)
cols = 8
rows = 8  # 64 slots for 60 frames
thumb_w = 200
thumb_h = int(thumb_w * 720 / 1280)  # ~112

montage = np.zeros((rows * thumb_h, cols * thumb_w, 3), dtype=np.uint8)

frame_indices = list(range(0, 240, 4))
if 239 not in frame_indices:
    frame_indices.append(239)

for idx, f_num in enumerate(frame_indices):
    r = idx // cols
    c = idx % cols
    img_path = os.path.join("scratch_frames", f"frame_{f_num:03d}.jpg")
    if os.path.exists(img_path):
        img = cv2.imread(img_path)
        img_resized = cv2.resize(img, (thumb_w, thumb_h))
        # Draw frame number
        cv2.putText(img_resized, f"{f_num}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        montage[r*thumb_h:(r+1)*thumb_h, c*thumb_w:(c+1)*thumb_w] = img_resized

cv2.imwrite("scratch_frames/montage.jpg", montage)
print(f"Montage saved with {len(frame_indices)} frames.")
