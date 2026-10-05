import os
import cv2
import numpy as np

video_path = os.path.join("public", "Character.mp4")
if not os.path.exists(video_path):
    video_path = os.path.join("public", "character.mp4")

print(f"Opening video: {video_path}")
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error: Could not open video file.")
    exit(1)

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(f"FPS: {fps}")
print(f"Total frames: {total_frames}")
print(f"Resolution: {width}x{height}")
print(f"Duration: {total_frames / fps:.2f} seconds")

# Also sample background color from the corner of the first frame
ret, frame = cap.read()
if ret:
    # Sample 4 corners (top-left, top-right, bottom-left, bottom-right)
    tl = frame[5:15, 5:15]
    tr = frame[5:15, width-15:width-5]
    bl = frame[height-15:height-5, 5:15]
    br = frame[height-15:height-5, width-15:width-5]
    
    corners = np.concatenate([tl, tr, bl, br], axis=0)
    avg_bgr = np.mean(corners, axis=(0, 1))
    avg_rgb = [int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0])]
    hex_color = f"#{avg_rgb[0]:02x}{avg_rgb[1]:02x}{avg_rgb[2]:02x}"
    print(f"Background BGR: {avg_bgr}")
    print(f"Background RGB: {avg_rgb}")
    print(f"Background Hex: {hex_color}")

cap.release()
