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

# Key compass directions:
# UP: 44
# UP_RIGHT: 64
# RIGHT: 88
# DOWN_RIGHT: 106
# DOWN: 121
# DOWN_LEFT: 144
# LEFT: 161
# UP_LEFT: 174

# We want 64 frames along the 360° circular trajectory:
# 64 frames means:
# 0: UP (0° or -90° in standard math, let's say angle 0 is UP)
# 8: UP-RIGHT (45°)
# 16: RIGHT (90°)
# 24: DOWN-RIGHT (135°)
# 32: DOWN (180°)
# 40: DOWN-LEFT (225°)
# 48: LEFT (270°)
# 56: UP-LEFT (315°)
# and wrapping back to 64 -> 0: UP (360° = 0°)

# Let's test segment interpolation for the 8 sectors:
# Sector 0 (0..8): 44 to 64 (8 steps)
# Sector 1 (8..16): 64 to 88 (8 steps)
# Sector 2 (16..24): 88 to 106 (8 steps)
# Sector 3 (24..32): 106 to 121 (8 steps)
# Sector 4 (32..40): 121 to 144 (8 steps)
# Sector 5 (40..48): 144 to 161 (8 steps)
# Sector 6 (48..56): 161 to 174 (8 steps)
# Sector 7 (56..64): 174 to 44 (8 steps)

# Let's see how Sector 7 (174 to 44) can be sampled.
# Candidate frames for sector 7:
# 174 -> 176 -> 177 -> 178 -> 41 -> 42 -> 43 -> 44
# Let's inspect the diffs and visual continuity between these frames!

print("Testing sector frame sequences...")
