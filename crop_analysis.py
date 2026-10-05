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

print(f"Loaded {len(frames)} frames")

# Crop head area: y from 20 to 460, x from 520 to 760 (width 240, height 440)
def crop_head(f, num):
    crop = f[20:460, 520:760].copy()
    cv2.putText(crop, str(num), (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
    return crop

# Create 2 montages:
# 1) frames 36 to 115 (UP to RIGHT to DOWN)
# 2) frames 116 to 195 (DOWN to LEFT to UP)
# 3) center candidates (0-20, 195-239)

def build_grid(idx_list, cols=10):
    rows = (len(idx_list) + cols - 1) // cols
    cell_h, cell_w = 220, 120
    grid = np.zeros((rows * cell_h, cols * cell_w, 3), dtype=np.uint8)
    for i, idx in enumerate(idx_list):
        r = i // cols
        c = i % cols
        ch = cv2.resize(crop_head(frames[idx], idx), (cell_w, cell_h))
        grid[r*cell_h:(r+1)*cell_h, c*cell_w:(c+1)*cell_w] = ch
    return grid

g1 = build_grid(list(range(36, 116, 2)), cols=10)
cv2.imwrite("scratch_frames/grid_part1.jpg", g1)

g2 = build_grid(list(range(116, 196, 2)), cols=10)
cv2.imwrite("scratch_frames/grid_part2.jpg", g2)

g3 = build_grid([0, 4, 8, 12, 16, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236], cols=8)
cv2.imwrite("scratch_frames/grid_center.jpg", g3)

print("Saved grid_part1, grid_part2, grid_center")
