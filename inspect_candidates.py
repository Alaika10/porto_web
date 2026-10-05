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

candidates = {
    "UP": list(range(41, 47)),
    "UP_RIGHT": list(range(61, 67)),
    "RIGHT": list(range(85, 91)),
    "DOWN_RIGHT": list(range(104, 110)),
    "DOWN": list(range(120, 126)),
    "DOWN_LEFT": list(range(142, 148)),
    "LEFT": list(range(160, 166)),
    "UP_LEFT": list(range(173, 179))
}

for direction, f_nums in candidates.items():
    imgs = []
    for f in f_nums:
        img = frames[f][30:450, 530:750].copy()
        cv2.putText(img, f"{f}", (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        imgs.append(img)
    strip = np.hstack(imgs)
    cv2.imwrite(f"scratch_frames/cand_{direction}.jpg", strip)

print("Saved candidate strips for all 8 directions.")
