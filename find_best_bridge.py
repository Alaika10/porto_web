import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = [cap.read()[1] for _ in range(240)]
cap.release()

# We want 8 steps to go from 174 to 44.
# Let's consider candidate frames:
# From [174, 175, 176, 177, 178, 179, 180, 181, 182] to [32, 34, 36, 38, 40, 42, 44]
# Or all frames in the video!

# Let's compute pairwise difference matrix between all frames in pool
pool_A = list(range(174, 186)) # coming from UP-LEFT
pool_B = list(range(28, 45))   # going up to UP

best_pair = None
min_pair_diff = 999
for a in pool_A:
    for b in pool_B:
        d = np.mean(cv2.absdiff(frames[a], frames[b]))
        if d < min_pair_diff:
            min_pair_diff = d
            best_pair = (a, b)

print(f"Best bridge pair: {best_pair} with diff: {min_pair_diff:.2f}")

# Let's inspect the top 5 bridge pairs:
pairs = []
for a in pool_A:
    for b in pool_B:
        d = np.mean(cv2.absdiff(frames[a], frames[b]))
        pairs.append((d, a, b))
pairs.sort()
for d, a, b in pairs[:8]:
    print(f"Pair: {a} -> {b}, diff: {d:.2f}")
