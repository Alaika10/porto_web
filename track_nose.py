import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = []
while True:
    ret, f = cap.read()
    if not ret:
        break
    frames.append(f)
cap.release()

# Let's track the nose / face feature in frames 30 to 190.
# In frame 204 (center), the nose tip / nose bridge is around (640, 290).
# Let's use template matching of a small patch around the nose / eyes from frame 204 or frame 44.
# Let's crop the nose patch from frame 204:
patch = frames[204][280:310, 625:655] # 30x30 patch around nose

coords = []
for i in range(len(frames)):
    # Search within the face box [150:450, 500:780]
    search_area = frames[i][150:450, 500:780]
    res = cv2.matchTemplate(search_area, patch, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    # Global coordinate
    nx = 500 + max_loc[0] + 15
    ny = 150 + max_loc[1] + 15
    coords.append((i, nx, ny, max_val))

# Let's see the coordinates for key frames:
print("Key frame coordinates:")
for f in [44, 64, 88, 106, 121, 144, 161, 174, 178, 182, 186, 190, 204]:
    print(f"Frame {f:03d}: x={coords[f][1]}, y={coords[f][2]}, match={coords[f][3]:.2f}")
