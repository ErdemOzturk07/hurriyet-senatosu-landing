# Katkı Rehberi (CONTRIBUTING)

Bu projeye katkına hoş geldin! 🙌 Süreç kasıtlı olarak basit: her değişiklik bir branch'te yapılır, Pull Request (PR) ile gönderilir ve review sonrası `main`'e alınır.

## Proje nedir?

Statik bir landing page:

- `index.html` — sayfa yapısı ve içerik
- `assets/css/main.css` — stiller
- `assets/js/main.js` — etkileşimler
- `assets/img/` — görseller ve medya

Build adımı yoktur. `index.html`'i tarayıcıda açman yeterlidir (istersen `python -m http.server` gibi basit bir sunucu da kullanabilirsin).

## Kurulum

```bash
git clone https://github.com/ErdemOzturk07/hurriyet-senatosu-landing.git
cd hurriyet-senatosu-landing
```

## Katkı akışı

1. Güncel `main`'den yeni bir branch aç:

   ```bash
   git checkout main
   git pull
   git checkout -b katki/kisa-aciklama
   # örn: katki/mobil-menu-duzeltme
   ```

2. Değişikliğini yap ve tarayıcıda test et:
   - JS konsolunda hata yok,
   - mobil görünüm bozulmadı (tarayıcıda cihaz modundan bak).

3. Commit'le ve push'la:

   ```bash
   git add .
   git commit -m "Kısa ve açıklayıcı Türkçe mesaj"
   git push -u origin katki/kisa-aciklama
   ```

4. GitHub'da **Pull Request** aç:
   - Sağdaki **Reviewers** kısmından **@ErdemOzturk07**'yi seç,
   - Açıklamada şu 3 soruyu yanıtla: **Ne değişti? Neden? Nasıl test edilir?**

Soru veya öneri için GitHub'da Issue açabilirsin.

## Kurallar

- `main` branch'i **korumalıdır**: doğrudan push atılamaz; merge için en az 1 onay gerekir.
- Küçük ve tek amaçlı PR'lar aç; büyük işleri parçalara böl.
- Gizli bilgi (API key, token, şifre) **asla** commit'leme — repo herkese açıktır. `.env` gibi dosyalar zaten `.gitignore`'dadır.
- Büyük medya dosyası (`.mp4`, `.mp3` vb.) eklemeden önce sor.
- AI araçları kullanmakta özgürsün; gönderdiğin koddan sen sorumlusun. 😊

## Review süreci

PR'lar önce AI destekli bir ön incelemeden geçer (diff özeti, güvenlik/bug taraması, tarayıcıda görsel test), ardından Erdem son kararı verir. Düzeltme istenirse aynı branch'e yeni commit'lerle devam et — yeni PR açmana gerek yok.
