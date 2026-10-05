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

# Check difference between frames near 175 and frames near 42
for f1 in [173, 174, 175, 176, 177]:
    for f2 in [42, 43, 44, 45, 46]:
        diff = cv2.absdiff(frames[f1], frames[f2])
        mean_diff = np.mean(diff)
        print(f"Diff between {f1} and {f2}: {mean_diff:.2f}")
