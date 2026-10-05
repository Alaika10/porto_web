import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")

# Let's inspect frame by frame around the compass directions
# Let's export frames 30 to 195 every 2 frames with frame numbers
img_list = []
for i in range(240):
    ret, frame = cap.read()
    if not ret:
        break
    if i in [36, 40, 44, 48, 60, 68, 76, 84, 92, 100, 108, 116, 120, 124, 132, 140, 148, 156, 160, 164, 172, 176, 180, 184, 188, 192, 200, 204, 208, 212, 216, 220, 224, 228, 232]:
        cv2.putText(frame, f"F:{i}", (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3)
        cv2.imwrite(f"scratch_frames/det_{i:03d}.jpg", frame)

cap.release()
print("Saved detailed frames")
