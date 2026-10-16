# Görsel Planı — Sayfadaki Olaylar ve Bulunabilir Görselleri

Amaç: Landing page'de adı geçen tarihî olaylar/hareketler için doğrulanmış,
indirilebilir görselleri eşleştirmek ve siteye yerleşim planını tanımlamak.

Kurallar:
- Görseller **self-host** edilir (`assets/img/tarih/`) — sitede üçüncü taraf istek yok ilkesi korunur.
- **Kamu malı (PD)** görseller kredi gerektirmez. **CC BY / CC BY-SA** görsellere küçük kredi notu eklenir (küçük caption veya footer'da "Görseller: Wikimedia Commons" satırı).
- Optimizasyon: 800–1100px genişlik, JPG, ~100–150 KB hedef; `loading="lazy"` + `decoding="async"` + width/height; alt metinleri içerikle uyumlu yazılır.

## A) Kökenler · 1765 — kilometre taşı kartları (hepsi PD, kredi yok)

> **Durum: uygulandı ✓** (main.css v18) — 7 görsel `assets/img/tarih/` altında; kartlarda s/b durur, hover'da doğal renk. Gettysburg paragrafının yanında çerçeveli.

| Kart | Önerilen görsel (Wikimedia Commons dosya sayfası) |
|---|---|
| Pul Vergisi (Stamp Act) | [Proof sheet of one penny stamps, 1765](https://commons.wikimedia.org/wiki/File:Proof_sheet_of_one_penny_stamps_Stamp_Act_1765.jpg) — British Library |
| Sadık Dokuzlar (Loyal Nine) | [The Colonists Under Liberty Tree](https://commons.wikimedia.org/wiki/File:P109_The_Colonists_Under_Liberty_Tree.jpg) |
| Hürriyet Ağacı | [Paul Revere: Obelisk under Liberty Tree (1766)](https://commons.wikimedia.org/wiki/File:A_view_of_the_obelisk_erected_under_Liberty-Tree_in_Boston_on_the_rejoicings_for_the_repeal_of_the_Stamp_Act_-_19495221702.jpg) |
| Hürriyetin Çocukları (Sons of Liberty) | [Sons of Liberty Broadside, 1765](https://commons.wikimedia.org/wiki/File:Sons_of_Liberty_Broadside,_1765.jpg) — alt: [Bostonians Paying the Excise-Man, 1774](https://commons.wikimedia.org/wiki/File:Philip_Dawe_(attributed),_The_Bostonians_Paying_the_Excise-man,_or_Tarring_and_Feathering_(1774).jpg) veya [Revere: A View of the Year 1765](https://commons.wikimedia.org/wiki/File:A_View_of_the_Year_1765.jpg) |
| Boston Çay Partisi | [Currier: Destruction of Tea at Boston Harbor (1846)](https://commons.wikimedia.org/wiki/File:Destruction_of_tea_at_Boston_Harbor_LCCN91795889.jpg) |
| Bağımsızlık Bildirgesi | [Trumbull: Declaration of Independence (1819)](https://commons.wikimedia.org/wiki/File:Declaration_of_Independence_(1819),_by_John_Trumbull.jpg) |
| Gettysburg (geniş kapanış kartı) | [Lincoln's Gettysburg Address, Gettysburg (1863)](https://commons.wikimedia.org/wiki/File:Lincoln%27s_Gettysburg_Address,_Gettysburg.jpg) — Bachrach |

## B) "Aynı çizgi Türkiye'de" — 3 kart

> **Durum: uygulandı ✓** (main.css v19) — II. Meşrutiyet / Cumhuriyet / Özal dönemi ayrı kartlar; görseller kullanıcı tarafından sağlandı (basın arşivleri — telif durumu Commons gibi net değil; istenirse kamu malı eşdeğerlerle değiştirilebilir).

| Kart | Görsel | Lisans |
|---|---|---|
| II. Meşrutiyet | [II. Meşrutiyet'in İlanı (1908) kartpostalı](https://commons.wikimedia.org/wiki/File:II._Me%C5%9Frutiyet%27in_%C4%B0lan%C4%B1_(1908).jpg) — alt: [Osmanlı Meclisi, Aralık 1908](https://commons.wikimedia.org/wiki/File:Ottoman_Parliament_Dec1908.jpg) | PD |
| Cumhuriyet ve Özal dönemi | [Turgut Özal 1986](https://commons.wikimedia.org/wiki/File:Turgut_%C3%96zal_1986.jpg) — alt: [Özal'ın AET ziyareti](https://commons.wikimedia.org/wiki/File:Visit_of_Turgut_%C3%96zal,_Turkish_Prime_Minister,_to_the_CEC.jpg) | CC BY-SA 2.0 / CC BY 4.0 — kredi gerekir |

## C) Taban hareketleri — 6 kart (modern; uluslararasılar CC)

| Kart | Görsel | Lisans |
|---|---|---|
| Tea Party (ABD) | [Taxpayer March on Washington, 12 Eylül 2009](https://commons.wikimedia.org/wiki/File:Sept_12,_2009_-_Tea_Party_Tax_Payer_Protest,_Washington_DC.jpg) | CC — kredi |
| Sarı Yelekliler (Fransa) | [Yellow vests protest](https://commons.wikimedia.org/wiki/File:Yellow_vests_protest.jpg) — alt: [Yellow Vests Act 13, Paris](https://commons.wikimedia.org/wiki/File:Yellow_Vests_-_Act_13.jpg) | CC — kredi |
| Occupy Wall Street (ABD) | [OWS Crowd 2011](https://commons.wikimedia.org/wiki/File:Occupy_Wall_Street_Crowd_2011_Shankbone.JPG) — kategori bol | CC BY 3.0 — kredi |
| EYT | Arşiv zayıf → ikonlu kalsın (veya ileride gündem olursa arşiv taranır) | — |
| KYK borçları | Arşiv zayıf → ikonlu kalsın | — |
| Bedelli askerlik | Arşiv zayıf → ikonlu kalsın | — |

## D) Para sistemi referansları

| Yer | Görsel önerisi | Not |
|---|---|---|
| Chicago Planı / tam rezerv (#parasistemi + kart) | Commons'ta "Irving Fisher" portresi (PD) | Chicago Planı'nın öncü iktisatçısı |
| Merkez Bankası başlığı | Commons'ta "Central Bank of the Republic of Turkey" / Fed binası fotoğrafları (CC) | opsiyonel |
| #slogan bandı | Çok düşük opaklıkta eski para/gravür dokusu | opsiyonel, dikkatli |

## E) Çözüm kartları (opsiyonel — önerilmez, kartlar şişer)

- Common Law → Magna Carta (1215, PD)
- Tekel/karteller → John D. Rockefeller portresi (PD)
- Negatif gelir vergisi → Milton Friedman (PD, US gov)

Bunlar için daha doğru yer: ileride açılacak "İcraat Galerisi".

## Yerleşim önerileri (tasarım uyumu)

1. **Kökenler kartları (A):** her kartın üstüne 16:10 görsel alanı; sarı 2px çerçeve + offset gölge (kart stiliyle aynı); yıl baloncuğu ve 01–06 numarası korunur. En güçlü hamle: 6 kart "mini hikâye"ye dönüşür.
2. **Türkiye kartları (B):** feature-grid kartlarında üstte 16:9 görsel bandı.
3. **Taban kartları (C):** grid-3 kartlarında üstte görsel; CC olanlarda küçük kredi notu.
4. Tüm görseller `assets/img/tarih/` altında; cache-buster gerekmez (yeni dosyalar).

## Teknik işlem akışı (uygulama sırasında)

1. Original indir → ffmpeg ile 800–1100px'e küçült + JPG q~78 (~100–150 KB).
2. `assets/img/tarih/` altına koy; HTML'e `<figure>` + alt metni ekle.
3. Kart CSS'i (`.ms-shot`, `.fg-shot`) ekle; `main.css` sürümünü artır.
4. Yerel test (1400/390) → commit + push → `npx vercel deploy --prod` → canlı doğrula.
