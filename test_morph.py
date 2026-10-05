import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = [cap.read()[1] for _ in range(240)]
cap.release()

# Let's inspect frame 176 and frame 42
f1 = frames[176]
f2 = frames[42]

# Let's create 4 intermediate blended frames
blends = []
for alpha in [0.0, 0.25, 0.5, 0.75, 1.0]:
    b = cv2.addWeighted(f1, 1.0 - alpha, f2, alpha, 0)
    blends.append(b)

# Check crop
crops = [b[30:450, 530:750] for b in blends]
strip = np.hstack(crops)
cv2.imwrite("scratch_frames/morph_test.jpg", strip)
print("Saved scratch_frames/morph_test.jpg")
