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

# Let's save every single frame from 36 to 48 and 170 to 192
for f_idx in list(range(36, 50)) + list(range(170, 194)):
    crop = frames[f_idx][20:460, 520:760].copy()
    cv2.putText(crop, f"{f_idx}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)
    cv2.imwrite(f"scratch_frames/single_{f_idx:03d}.jpg", crop)

print("Saved single frames for inspection")
