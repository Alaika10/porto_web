import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = [cap.read()[1] for _ in range(240)]
cap.release()

# Let's compute frame-to-frame diff across the entire video
diffs = []
for i in range(len(frames) - 1):
    d = np.mean(cv2.absdiff(frames[i], frames[i+1]))
    diffs.append((i, d))

print("Top motion frames (highest change):")
sorted_diffs = sorted(diffs, key=lambda x: x[1], reverse=True)
for i, d in sorted_diffs[:15]:
    print(f"Frame {i:03d}->{i+1:03d}: diff={d:.2f}")

print("\nLowest motion frames (stationary/poses):")
for i, d in sorted_diffs[-15:]:
    print(f"Frame {i:03d}->{i+1:03d}: diff={d:.2f}")
