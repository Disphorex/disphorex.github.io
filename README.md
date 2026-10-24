# Olfactus & Parfümeri

- `index.html` : Olfactus / Parfümeri geçiş sayfası
- `olfactus/` : dergi (`img/` içinde posterler)
- `parfumeri/` : fiyat paneli (arayüz kodu `index.html`)
- `parfumeri/data/` : Pazar sekmesinin satıcı verileri

## Yönetim paneli
`/admin/` adresinden (ör. `siteadresi/admin/`) GitHub erişim anahtarıyla girilir; satıcı ve ürün ekleme / silme / düzenleme yapılıp tek tuşla depoya kaydedilir. Anahtar: Fine-grained token, yalnızca bu depo, *Contents: Read and write*.

## Güncelleme (elle)
Pazar verisini değiştirmek için yalnızca `parfumeri/data/` içindeki ilgili dosya yüklenir. Kodu değiştirmek gerekmez.

- **Satıcıyı tamamen yenilemek:** `famakdefragancia.json` gibi dosyanın üzerine yazın.
- **Sadece ürün eklemek / fiyat güncellemek:** küçük bir dosya hazırlayın (ör. `famak-2.json`), içinde `"base"` (satıcı adresi), `"append": true` ve `"items"` olsun, sonra dosya adını `data/index.json` içindeki `files` listesinin sonuna ekleyin. Aynı ad ve hacimdeki ürün güncellenir, yenisi eklenir.
- `data/index.json` içindeki `date` alanı Pazar sekmesinde görünen tarihtir.

Ürün satırı: `[ad, güncel fiyat, eski fiyat|null, ml|null, yol, "x" (tükendi), seçenekler, "", kategori]`

Sayfayı çift tıklayıp açmayın; veri dosyaları yalnızca GitHub Pages (veya yerel sunucu) üzerinden okunur. Güncelleme sonrası eski görünüm gelirse sayfayı yenileyin.
