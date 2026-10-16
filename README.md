# Hürriyet Senatosu — Landing Page (v2)

Tek sayfalık, bağımlılıksız statik landing. Tema: sarı-siyah-beyaz, dolmakalem (logo) motifi.
Hero: solda hook, sağda VSL. Mobil öncelikli, erişilebilir, üçüncü taraf script yok.

🔗 Canlı (test yayını): https://erdemozturk07.github.io/hurriyet-senatosu-landing/

## Çalıştırma

Statik dosya — build gerekmez. Üç yol var:

**1) Çift tıkla (en kolay):** `baslat.bat` → sunucu başlar ve tarayıcı
http://localhost:8000 adresinde açılır. Kapatmak için açılan pencerede **Ctrl+C**
(ya da pencereyi kapat). Zaten çalışıyorsa ikinci kez başlatmaz, tarayıcıyı açar.
Masaüstünde **"Hurriyet Senatosu (Onizleme)"** kısayolu da hazır.

**2) Sunucusuz:** `index.html`'e çift tıkla — sayfa `file://` ile de çalışır, sunucu gerekmez.

**3) Terminalden:**

```powershell
cd C:\Users\Erdem\hurriyet-senatosu-landing
python scripts/serve.py 8000        # --open eklersen tarayıcıyı da açar
# http://localhost:8000
```

`scripts/serve.py` her yanıta `Cache-Control: no-store` ekler: VS Code'da CSS/JS'i
kaydedip tarayıcıda **F5** yaptığında değişiklik anında görünür. Klasik
`python -m http.server 8000` kullanırsan tarayıcı eski CSS'i önbellekten servis edebilir;
o durumda **Ctrl+F5** (sert yenileme) yap. CSS/JS bağlantılarındaki `?v=5` eki de
bir kerelik önbellek kırıcıdır — büyük bir değişiklikte bir artır (`?v=6`).

## Yapı

```
index.html                      — tek sayfa (semantik, lang="tr")
assets/css/fonts.css            — self-hosted font tanımları (build çıktısı)
assets/css/main.css             — tema + bileşenler (tek tema: marka sarısı)
assets/js/main.js               — ref aktarımı, VSL, sayaç, filtre, reveal, scrollspy
assets/fonts/*.woff2            — Montserrat + Inter (latin + latin-ext)
assets/img/vsl-poster.jpg       — VSL videosunun 36. sn'sinden alınan 9:16 poster (608x1080)
assets/img/hur-senator.png      — kullanılmıyor (sembol/rozet vurgusu kaldırıldı; dosya arşiv olarak duruyor)
assets/img/login-ekrani.png     — platform giriş ekranı (721x570, "1. adım" kartındaki çerçeveli görsel)
scripts/serve.py                — önbelleksiz yerel önizleme sunucusu
baslat.bat                      — çift tıkla çalıştır (sunucu + tarayıcı)
scripts/setup-assets.ps1        — asset üretimi (font indirme, poster kare alma)
```

## Yayınlama (hosting)

**Canlı (test yayını):** https://erdemozturk07.github.io/hurriyet-senatosu-landing/
**Repo:** github.com/ErdemOzturk07/hurriyet-senatosu-landing (public — ücretsiz GitHub'da
Pages yalnızca public repolarda çalışır; `README.md`, `scripts/` gibi iç dosyalar da görünür)

Yayın **GitHub Pages** ile `main` dalından yapılır (kaynak: branch `main`, klasör `/`).
`.nojekyll` dosyası Jekyll işlemeyi kapatır; her push ~1 dakikada yayına girer.

### Güncelleme akışı

```powershell
cd C:\Users\Erdem\hurriyet-senatosu-landing
git add -A
git commit -m "metin güncellemesi"
git push
```

VS Code → **Source Control** panelinden de commit + push yapabilirsin. Değişiklik hemen
görünmezse sayfayı **Ctrl+F5** ile yenile.

**Kapatmak için:** repo → Settings → Pages → Unpublish (veya repo'yu tekrar private yap;
ücretsiz hesapta private repo'dan Pages yayını çalışmaz, site offline olur).

### İleride: istenirse taşıma (keşfedilmemiş URL + özel alan adı + giriş koruması)

Resmileşmeye başlayınca **Cloudflare Pages**'e taşınabilir (ücretsiz plan, private repo
destekler). Repo/kod aynı kalır; tek eksik Cloudflare ayarları:

- Framework preset: **None**
- Build command: `mkdir -p dist && cp -r index.html assets dist/ && rm -f dist/assets/img/hur-senator.png`
  (yalnızca site dosyalarını yayına alır; `scripts/`, `baslat.bat`, `README.md` yayına gitmez)
- Build output directory: `dist`
- Production branch: `main`

Avantajları: link tahmin edilemez (`<proje>.pages.dev`), kendi alan adı (ör.
`tanitim.hursenato.com`) ücretsiz bağlanır, ileride **Cloudflare Access** (ücretsiz,
50 kişiye kadar) ile e-posta girişli koruma açılabilir. Netlify/Vercel'e göre bant
genişliği sınırsız ve ticari kullanım kısıtı yok.

`scripts/setup-assets.ps1` yeniden çalıştırılabilir; fontları ve görselleri yeniden üretir.
Font indirme başarısız olursa sistem font zincirine düşer (sayfa çalışmaya devam eder).

### İçerik kaynağı (fikrî çerçeve)

Hareketin tanıtım videosundaki (VSL) anlatım, sayfanın fikrî çerçevesine işlendi.
Bölümler ve karşılıkları:

- `#hurriyetler` **Üç hürriyet** — fikir, din ve vicdan, teşebbüs; öncelik sırası
  (önce serbest piyasa, ardından diğer ikisi).
- `#kokenler` **Kökenler · 1765** — 6 adımlı çizgi: 1765 Pul Vergisi →
  Sadık Dokuzlar (Loyal Nine) → Hürriyet Ağacı adı (tarihî kayıt; John Avery ve
  Henry Bass) → Hürriyetin Çocukları (Sons of Liberty) → 1773 Boston Çay Partisi
  (Samuel Adams, John Adams) → 1776 Bağımsızlık Bildirgesi ve kurucu metinler
  (Jefferson, Gettysburg konuşması). Ardından "Aynı çizgi Türkiye'de":
  II. Meşrutiyet ve Özal dönemi.
- `#model` **Öncü grup** — Sadık Dokuzlar örneğinden hareketin kendi ölçeğine köprü:
  9 (1765) → 16 imzacı (bugün) → 5.000 (2027 sonu). Sayılar sayaçla canlanır.
- `#netlik` **Kavram netliği** — hedonizm/sol liberalizm/anarşizm ayrımı ve
  "zenginlerin daha da zengin olması değildir" maddesi; ayrıca 6 maddelik "Küçük sözlük".
- SSS'te Hürriyet Ağacı, libertaryenizm karışıklığı, küçük grupla başlama ve fikrî
  çerçeve maddeleri var. Manifesto bandında "1765'te küçük bir grupla başladı" notu.

**Sembol/bayrak vurgusu kaldırıldı:** Rozet (hur-senator.png), ağaç amblemi, footer'daki
"Sembolümüz" satırı ve Gadsden bayrağı karşılaştırmaları sayfadan çıkarıldı; "Hürriyet Ağacı"
yalnızca 1765 tarihini anlatan yerlerde ad olarak geçiyor. `#treeMark` sembolü SVG'de
duruyor ama kullanılmıyor.

Birebir alıntı yoktur; kişilere atfedilen söz yoktur (2008 kitabı gibi kişisel
atıflar bilinçli olarak dışarıda bırakıldı). Dinî ifadeler ana metne alınmadı;
sayfa "ideolojiden bağımsız katılım" çizgisini korur.

## Teknik notlar

- **Dikey VSL (9:16, short-form):** Oynatıcı hero'da dikey çerçevede durur. Ölçüler `assets/css/main.css` içindeki `:root` değişkenleriyle ayarlanır:
  `--vsl-w` (genişlik, varsayılan 320px), `--vsl-ratio` (9/16), `--vsl-crop` (kırpma oranı, varsayılan `316.05%`).
  Mevcut 1920×1080 video, ortasındaki 9:16 bölgeyi göstermek için zoom + kırpma ile oynatılır
  (kaynağın içerik alanı ortada 923×1080; kenarlarda pay var). **Gerçek dikey video gelince
  `--vsl-crop:100%` yapın ve posteri tam kare (ör. 1080×1920) üretin.**
- **Kontrol şeridi:** YouTube'un kendi kontrolü kırpıldığı için özel şerit kullanılır
  (oynat/duraklat, sürüklenebilir ilerleme, süre). YouTube tarafı `controls=0` ile gömülür;
  durum/süre, IFrame API üzerinden ~400 ms'de bir okunur (API scripti yalnızca tıklama sonrası yüklenir).
- **Sorun şeridi (ticker):** Düz durur (açı yok), ekranı kenardan kenara kaplar (`width:108vw`).
  İçerik, yarım tur şeridi her zaman dolduracak kadar çoğaltılır ve hız sabit tutulur (~70 px/sn);
  döngü kesintisizdir. `prefers-reduced-motion` açıkken animasyon durur.
- **Reveal emniyet kemeri:** Bölümler IntersectionObserver ile açılır; çok hızlı kaydırmada
  gözden kaçan öğeler için 160 ms gecikmeli bir `scroll` denetimi, görünür alandaki her öğeyi açar
  (boş bölüm kalmasın).
- **Reveal gecikmesi temizliği:** Kartlara giriş animasyonu için verilen kademeli gecikme
  (`transition-delay`) reveal bitince JS ile silinir; aksi halde hover ve filtre geçiş
  animasyonlarına da bulaşıp gecikmeli tepki veriyordu. Filtre değişiminde yalnızca yeni
  görünen kartlar `pop` animasyonu oynatır (ekranda duranlar yeniden oynamaz).
- **Gizlilik:** Sayfa açılışında üçüncü taraf istek yok (doğrulandı). YouTube alan adları yalnızca
  "oynat"a basıldıktan sonra devreye girer; `ref` parametresi linke eklenir, cookie/localStorage'a yazılmaz.

## Metinleri nerede değiştirirsin?

- **Tüm sayfa metinleri:** `index.html` — bölümler `id` ile ayrılmıştır:
  `#ust` (hero) · `#sorun` (şerit) · `#nasil` · `#cozumler` (kartlar) · `#nedir` ·
  `#hurriyetler` · `#kokenler` · `#model` · `#netlik` (sözlük) · `#guven` · `#sss` ·
  manifesto + `#son` (final). Türkçe yazımda `&rsquo;` (') ve `&mdash;` (—) kullanılır.
- **Bağlantılar ve video:** `assets/js/main.js` → en üstteki `CONFIG`
  (`APPLY_URL`, `LOGIN_URL`, `STORE_URL`, `VSL_URL`, `REF_PARAM`).
- **"Nasıl işliyor?" kartları:** 1. karttaki giriş ekranı görseli
  `assets/img/login-ekrani.png` (değiştirirsen aynı dosya adını kullan; görselin
  `<img ... width height>` değerlerini de yeni boyuta göre güncelle).
  3. karttaki paylaşım düğmelerinin **mesaj metni** `index.html` içinde
  `data-share-text="..."` ile **düz Türkçe** yazılır — yüzde kodlamayı JS üretir;
  paylaşılacak adres `data-share-base="..."`. (JS kapalıysa HTML'deki hazır
  `href`'ler kullanılır; o metni de değiştirdiysen [urlencoder.org](https://www.urlencoder.org/)'dan kopyalayabilirsin.)
- **Renkler, boşluklar, oynatıcı ölçüsü:** `assets/css/main.css` → en üstteki `:root`
  değişkenleri (`--paper`, `--ink`, `--vsl-w`, `--vsl-crop` …).
- **Yeni metin eklerken:** `{{...}}` biçimindeki placeholder'ları doldurmayı unutma (aşağıdaki tablo).
  Doldurulmamış `{{...}}` linkleri kırık kalmaz: **cümle içindeyse** metin kalır, link devre dışı
  olur (altı çizilmez); **tek başınaysa** (footer menüsü) gizlenir. Gerçek değeri yazdığın anda
  hepsi normale döner.

Önizleme: `index.html`'i çift tıklayıp tarayıcıda açabilirsin (yazılar/görseller çalışır;
YouTube oynatıcı için `http://` gerekir → `python scripts/serve.py 8000` ile aç).

## Doldurulması gereken placeholder'lar (uydurulmadı)

| Placeholder | Nerede | Açıklama |
|---|---|---|
| `{{PLATFORM_APPLY_URL}}` | `assets/js/main.js` → `CONFIG.APPLY_URL` | ✅ Dolduruldu: `https://hursenato.com/` (`?ref=` bu adrese eklenir). Platformda ayrı bir başvuru yolu varsa değiştir |
| `{{PLATFORM_LOGIN_URL}}` | `CONFIG.LOGIN_URL` | ✅ Dolduruldu: `https://hursenato.com/` (giriş ayrı adresteyse değiştir) |
| ref parametre adı | `CONFIG.REF_PARAM` (`ref`) | Platform farklı ad kullanıyorsa değiştir |
| `{{STORE_URL}}` | `CONFIG.STORE_URL` + footer "Mağaza" linki | Hars Gazetesi/Dergi mağazası. **Boşken footer'daki bu link otomatik gizlenir** (kırık link çıkmaz) |
| `{{VSL_VIDEO_URL}}` | — (dolduruldu) | `CONFIG.VSL_URL` artık YouTube linki. YouTube veya mp4 desteklenir; YouTube IFrame API'si ve oynatıcı yalnızca "oynat"a basılınca yüklenir (`youtube-nocookie` host'u), sayfa açılışında üçüncü taraf isteği olmaz |
| `{{INFO_SOURCE_LINKS}}` | `index.html` çözümler bölümü | Uğur Güzel hesap linkleri |
| `{{KVKK_URL}}` | SSS + footer | Aydınlatma metni |
| `{{CONTACT}}` | footer | İletişim |
| `{{SOCIAL_LINKS}}` | footer | Sosyal linkler |
| `{{OG_IMAGE}}` | `<head>` OG/Twitter | Paylaşım görseli (1200x630); istenirse `assets/img/vsl-poster.jpg` kullanılabilir |
| `{{ANALYTICS}}` | `<head>` yorum satırı | Gerekiyorsa gizlilik-dostu analitik |
| `{{MEMBER_COUNT}}` | — | Canlı sayı yok, bilerek gösterilmiyor. Kaynak gelince hero-stats'a eklenir |

Not: `{{LOGO}}` placeholder'ı kaldırıldı — logo, resmî bannerdaki dolmakalem işaretinin
SVG kopyası (`#logoMark` sembolü) olarak header/footer/final bölümde kullanılıyor.
Vektör logo dosyası gelirse bu sembol birebir değiştirilebilir.

## Kabul kontrolü

- [x] 360px taşma yok (grid + wrap; yatay kaydırma çıkarmaz)
- [x] "Senatör Ol" CTA'sı hero + adımlar + final + sticky; `?ref=` linke taşınıyor, cookie/localStorage'a yazılmıyor
- [x] 16 / 5.000 / 2027 sonu / 2028 başı tutarlı
- [x] Gizlilik dili: "ad-soyad admin dışında görünmez, hassas bilgi istenmez" — anonimlik iddiası yok
- [x] Çözüm kartlarında kaynak dışı teknik detay yok; çözümler "hareketin iddiası" olarak çerçeveli
- [x] Üçüncü taraf script/takip yok; fontlar self-hosted
- [x] `lang="tr"`, İ/ı doğru; focus-visible, skip-link, `<details>` SSS, reduced-motion
- [x] Klavye ile gezinme; filtre butonlarında `aria-pressed`, filtre sonucu `aria-live`
- [x] Renk uyumu: tüm metin/ikon çiftlerinde kontrast eşiği geçiyor (`.card-tag` ve `.seal-tag`
      görünmezlik hataları düzeltildi — sarı/siyah zemin uyumu)
- [x] Koyu tema: otomatik (`prefers-color-scheme`) dark tema kaldırıldı — marka sarısı her
      sistemde aynı görünür; `color-scheme: light` ile form/scrollbar da açık temada
- [x] VSL dikey (9:16) çerçevede; poster görünür; YouTube'a yalnızca tıklamada bağlanılır
      (nocookie host); özel kontrol şeridi çalışır (oynat/duraklat, sarma, süre)
- [x] Şerit düz + kenardan kenara + kesintisiz döngü; hızlı kaydırmada boş bölüm kalmaz
- [x] Çözüm kartlarında kategori etiketi satır içinde alta hizalı (`margin-top:auto`)
- [x] "Nasıl işliyor?" üç kartı aynı yükseklikte: 1. kart gerçek giriş ekranı görseli
      (mini tarayıcı çerçevesi), 3. kart paylaş düğmeleri + örnek davet + referans çipi +
      hedef göstergesi; kartların altındaki boşluk kalmadı (552 px — 2 px tolerans)
- [x] Paylaş düğmeleri (WhatsApp/X/Telegram/E-posta) yeni sekmede açılır; mesaj metni
      HTML'de düz Türkçe durur, kodlamayı JS üretir; script yoksa hazır linkler çalışır
- [x] Footer'daki doldurulmamış `{{...}}` linkleri gizli, cümle içindekiler link olmaktan
      çıkıp metin olarak kalıyor (kırık link yok); `?ref=` altı başvuru linkinin tümüne
      taşınıyor (6/6), cookie/localStorage temiz; sayfa açılışında üçüncü taraf istek 0

## Sayfa akışı (bölüm sırası)

1. `#ust` hero — hook + dikey (9:16) VSL oynatıcı (VSL dikeyde ortalanır)
2. `#sorun` — sorun şeridi (düz, kenardan kenara, kesintisiz döngü)
3. `#nasil` — Nasıl işliyor? (3 adım + zaman çizelgesi) — beyaz bant
4. `#cozumler` — Çözüm modelleri (filtreli kartlar) — sarı bant
5. `#nedir` — Hürriyet Senatosu nedir? — siyah bant
6. `#hurriyetler` — Üç hürriyet
7. `#kokenler` — Kökenler · Hürriyet Ağacı (6 adım + Türkiye çizgisi) — siyah bant
8. `#model` — Model · Öncü grup (9 → 16 → 5.000)
9. `#netlik` — Kavram netliği + küçük sözlük — beyaz bant
10. `#guven` — Görünür olmak zorunda değilsin
11. `#sss` — SSS — beyaz bant
12. `manifesto` + `#son` final CTA — siyah
13. Kaldırıldı: `#katki` (bütçe katkısı bölümü)
