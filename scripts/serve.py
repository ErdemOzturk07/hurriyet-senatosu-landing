#!/usr/bin/env python3
"""Hürriyet Senatosu — yerel önizleme sunucusu (önbelleksiz).

Amaç: VS Code'da metni/CSS'i düzenleyip tarayıcıda F5 yaptığında
değişikliğin ANINDA görünmesi. `python -m http.server` bazı tarayıcılarda
CSS/JS'i önbellekten servis edebiliyor; bu script her yanıta
"Cache-Control: no-store" ekler.

Kullanım:
    python scripts/serve.py                 # http://localhost:8000
    python scripts/serve.py 8080            # farklı port
    python scripts/serve.py 8000 --open     # açılışta tarayıcıyı da açar
                                            # (baslat.bat bunu kullanır)

Not: Port zaten kullanılıyorsa hata vermez; "zaten çalışıyor" der ve
--open verilmişse tarayıcıyı yine açar. Böylece baslat.bat'a iki kez
tıklamak sorun çıkarmaz.
"""
import functools
import http.server
import os
import socket
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # sessiz günlük
        pass


def port_dinleniyor(port):
    """Portu dinleyen biri var mı?

    Windows'ta SO_REUSEADDR nedeniyle ikinci bir sunucu aynı porta
    sorunsuz bağlanabiliyor (portu 'çalabiliyor'); bu yüzden bağlanmadan
    önce portu kontrol ediyoruz.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.4)
        return s.connect_ex(("127.0.0.1", port)) == 0


def main():
    ac = "--open" in sys.argv or "-o" in sys.argv
    sayilar = [a for a in sys.argv[1:] if not a.startswith("-")]
    port = int(sayilar[0]) if sayilar else 8000
    url = f"http://localhost:{port}/"

    if port_dinleniyor(port):
        print(f"Port {port} zaten kullanimda; sunucu buyuk olasilikla calisiyor.")
        print(f"Adres: {url}")
        if ac:
            webbrowser.open(url)
        return

    handler = functools.partial(NoCacheHandler, directory=ROOT)
    try:
        httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    except OSError:
        print(f"Port {port} zaten kullanimda; sunucu buyuk olasilikla calisiyor.")
        print(f"Adres: {url}")
        if ac:
            webbrowser.open(url)
        return

    print(f"Hurriyet Senatosu onizleme: {url}")
    print(f"Kok klasor: {ROOT}")
    print("Durdurmak icin Ctrl+C")
    if ac:
        # Sunucu dinlemeye basladiktan sonra tarayiciyi ac (yaris durumu olmasin)
        threading.Timer(0.5, webbrowser.open, [url]).start()
    with httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nkapatildi")


if __name__ == "__main__":
    main()
