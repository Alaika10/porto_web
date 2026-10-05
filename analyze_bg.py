import cv2
import numpy as np

cap = cv2.VideoCapture("public/Character.mp4")
frames = [cap.read()[1] for _ in range(240)]
cap.release()

# Let's inspect the borders of the frames
# top border (y=0..30, x=0..1280)
# left border (y=0..720, x=0..30)
# right border (y=0..720, x=1250..1280)
frame_c = frames[204]

top_bg = frame_c[0:20, :]
left_bg = frame_c[:, 0:20]
right_bg = frame_c[:, 1260:]

print("Top edge mean RGB:", [int(x) for x in np.mean(top_bg, axis=(0,1))[::-1]])
print("Left edge mean RGB:", [int(x) for x in np.mean(left_bg, axis=(0,1))[::-1]])
print("Right edge mean RGB:", [int(x) for x in np.mean(right_bg, axis=(0,1))[::-1]])

# Let's check across all selected frames
top_left_pixel = frame_c[5, 5][::-1]
print("Top-left pixel RGB:", [int(x) for x in top_left_pixel])
print("Hex:", f"#{int(top_left_pixel[0]):02x}{int(top_left_pixel[1]):02x}{int(top_left_pixel[2]):02x}")
