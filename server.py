"""
Запусти этот файл вместо Live Server:
  python server.py
Затем открой в браузере: http://localhost:5500
"""
import os
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

VIDEO_MAP = {
    "hero.mp4":         r"C:\Users\Roman\Desktop\my-website\videos\hero.mp4",
    "sleep_phone.mp4":  r"D:\Videos\Nicely Done\Опасно ли спать рядом с телефоном with sub.mp4",
    "laundry.mp4":      r"D:\Videos\Nicely Done\Вредно ли сушить белье в квартире.MP4",
    "belly.mp4":        r"D:\Videos\Nicely Done\ДОСКА Откуда берётся вздутие в животе.mp4",
    "mushroom_ram.mp4": r"D:\Videos\Nicely Done\Грибы вместо ОЗУ финал.mp4",
    "vasilisa.mp4":     r"E:\Videos\Vasilisa LAST.mp4",
    "dasha.mp4":        r"E:\Videos\Dasha final.mp4",
    "lenya.mp4":        r"E:\Videos\Lenya Horizontal 3.mp4",
    "sidephone.mp4":    r"D:\Videos\Nicely Done\Sidephone Finale 2.mp4",
    "trifold.mp4":      r"D:\Videos\Nicely Done\Трикладушка.mp4",
}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        parts  = parsed.path.strip("/").split("/")
        if parts[0] == "videos" and len(parts) == 2 and parts[1] in VIDEO_MAP:
            self._stream(VIDEO_MAP[parts[1]])
        else:
            super().do_GET()

    def _stream(self, filepath):
        if not os.path.isfile(filepath):
            self.send_error(404, "Video not found")
            return

        size         = os.path.getsize(filepath)
        range_header = self.headers.get("Range")

        if range_header:
            raw   = range_header.replace("bytes=", "")
            parts = raw.split("-")
            start = int(parts[0]) if parts[0] else 0
            end   = int(parts[1]) if parts[1] else size - 1
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        else:
            start, end = 0, size - 1
            self.send_response(200)

        length = end - start + 1
        self.send_header("Content-Type",   "video/mp4")
        self.send_header("Content-Length", str(length))
        self.send_header("Accept-Ranges",  "bytes")
        self.end_headers()

        with open(filepath, "rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(65536, remaining))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    break

    def log_message(self, fmt, *args):
        pass  # убираем лишние логи в консоли


if __name__ == "__main__":
    port   = 5500
    server = HTTPServer(("localhost", port), Handler)
    print(f"\n  Сайт: http://localhost:{port}\n")
    print("  Ctrl+C — остановить сервер\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Сервер остановлен")
