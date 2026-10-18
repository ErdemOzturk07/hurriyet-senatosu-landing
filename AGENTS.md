# hurriyet-senatosu-landing — Agent Notları

Bu dosya, bu repoda çalışan AI agent'lar için proje kurallarıdır.

## Oturum başında rutin

1. `git status -sb` çalıştır; commit'lenmemiş değişiklik varsa kullanıcıya kısaca bildir.
2. `gh pr list --state open` çalıştır. Açık PR varsa numarasını, başlığını ve açan kişiyi bildir; review etmek isteyip istemediğini sor.

## Genel kurallar

- Proje statik bir landing page'dir: `index.html`, `assets/css/main.css`, `assets/js/main.js`, `assets/img/`. Build adımı yoktur.
- `main` korumalıdır: her değişiklik `katki/kisa-aciklama` formatında bir branch'te yapılır ve PR ile gönderilir. (Repo admin'i acil durumda bypass edebilir, ancak varsayılan akış PR'dır.)
- Commit mesajları Türkçe, açıklayıcı ve tek amaçlı olsun.
- Gizli bilgi (API key, token, şifre) asla commit'lenmesin; repo herkese açıktır.
- Büyük medya dosyası (`.mp4`, `.mp3`) eklemeden önce kullanıcıya sor.

## PR review rutini

- PR'ı, kullanıcının açık işlerini bozmadan incele: tercihen ayrı bir git worktree'de `gh pr checkout <no>`.
- `gh pr diff <no>` ile değişiklikleri incele ve Türkçe özet çıkar:
  1. Ne değişmiş, neden? (sade dille)
  2. Bug / güvenlik: yanlışlıkla commit'lenmiş secret, XSS riski, kırık link, konsol hatası.
  3. Stil uyumu: mevcut dosya düzeni ve kod stiliyle tutarlılık.
  4. Görsel doğrulama: `playwright-cli` ile sayfayı aç ve değişen bölümü test et.
  5. Karar önerisi: merge / değişiklik iste / reddet — gerekçesiyle.
- Merge yalnızca kullanıcının onayıyla yapılır: `gh pr merge <no> --squash --delete-branch`
