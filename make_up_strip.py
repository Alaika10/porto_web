import cv2
import numpy as np

# Load images 170 to 192 and 36 to 48
def make_strip(indices):
    imgs = []
    for idx in indices:
        im = cv2.imread(f"scratch_frames/single_{idx:03d}.jpg")
        imgs.append(im)
    return np.hstack(imgs)

# Let's stack 170..181, 182..193, 36..47
row1 = make_strip(range(170, 182))
row2 = make_strip(range(182, 194))
row3 = make_strip(range(36, 48))

# Resize rows to fit
max_w = max(row1.shape[1], row2.shape[1], row3.shape[1])
composite = np.zeros((row1.shape[0]*3, max_w, 3), dtype=np.uint8)
composite[0:row1.shape[0], 0:row1.shape[1]] = row1
composite[row1.shape[0]:row1.shape[0]*2, 0:row2.shape[1]] = row2
composite[row1.shape[0]*2:row1.shape[0]*3, 0:row3.shape[1]] = row3

cv2.imwrite("scratch_frames/up_transition.jpg", composite)
print("Saved up_transition.jpg")
