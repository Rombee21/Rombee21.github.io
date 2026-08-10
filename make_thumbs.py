import cv2

videos = [
    ("E:/Videos/Vasilisa LAST.mp4",      "thumb_vasilisa.jpg",  8),
    ("E:/Videos/Dasha final.mp4",         "thumb_dasha.jpg",     8),
    ("E:/Videos/Lenya Horizontal 3.mp4",  "thumb_lenya.jpg",     8),
]

out_dir = "C:/Users/Roman/Desktop/my-website/thumbnails/"

for path, name, sec in videos:
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(fps * sec))
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(out_dir + name, frame, [cv2.IMWRITE_JPEG_QUALITY, 88])
        print(f"OK: {name}")
    else:
        print(f"FAIL: {name}")
    cap.release()
