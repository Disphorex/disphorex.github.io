# Olfactus & Parfümeri

- `index.html` : Disphorex karşılama / landing sayfası
- `site.html` : Olfactus / Parfümeri geçiş sayfası (iki deneyimi tek ekranda açar)
- `olfactus/` : dergi (`img/` içinde posterler)
- `parfumeri/` : fiyat paneli (arayüz kodu `index.html`)
- `parfumeri/data/` : Pazar sekmesinin satıcı verileri

## Yönetim paneli
`/admin/` adresinden (ör. `siteadresi/admin/`) GitHub erişim anahtarıyla girilir. Pazar panelindeki “AI metadata” bağlantısı Gemini, Groq veya OpenAI destekli metadata aracını açar. Aracı aynı tarayıcıda admin token’ı varken kullanarak `products.json` dosyasını depodan okuyabilir ve onay sonrasında doğrudan aynı dosyaya commit edebilirsin; yerel JSON yükleme ve indirme de yedek akış olarak kalır; satıcı ve ürün ekleme / silme / düzenleme yapılıp tek tuşla depoya kaydedilir. Anahtar: Fine-grained token, yalnızca bu depo, *Contents: Read and write*.

## Veri Editörü

`/parfum-veri-editoru.html` GitHub Pages üzerinden açılır. Depo verilerini GitHub API ile okur ve onaylanan değişiklikleri tek commit olarak kaydeder; dosya yükleme/indirme akışı gerektirmez. İlk kullanımda admin panelinde kullanılan, yalnızca bu depoda `Contents: Read and write` yetkisi bulunan fine-grained token aynı tarayıcıda tanımlı olmalıdır.

Katalog geçişi başlamadan önce pano ve admin kodunun v2 uyumluluğu kontrol edilir. Eski kayıt adları master kimliklere çevrilir; benzer ürün adları ayrı tutulur ve yalnızca admin onayıyla birleştirilir.

## Merkezi ürün kataloğu (v2)

`parfumeri/data/products.json` ortak ürün kayıtlarını tutar. Her ürünün tekrar kullanılmayan sayısal `id` değeri ve `name`, `brand`, `variant`, `gender`, `season`, `time`, `category`, `aliases` alanları bulunur. Mevsim, kullanım zamanı ve koku ailesi çoklu seçim olduğunda dizi olarak saklanır; eski tek değerli kayıtlar da okunur. `index.json` içindeki `productsFile` kataloğu gösterir.

Satıcı dosyalarındaki `items[]` artık ürün adı yerine `product_id` ve satış bilgilerini tutar: `price`, `old_price`, `volume_ml`, `url`, `stock`, `options`, `seller_name` ve `volume_prices`. Pano ve admin paneli, katalog adını ID üzerinden çözer. Uygulama eski tuple verisini de geçiş için okuyabilir.

`products.schema.json` ve `seller.schema.json` JSON Schema tanımlarını içerir. `merge_rules.json` özel satıcı ürünlerinin yanlış eşleştirmeyle birleşmesini engeller. Benzer ürün isimleri otomatik birleştirilmez; Veri Editörü adayları gösterir ve onaylanan eşleştirmeyi tüm satıcı referanslarına tek commit içinde uygular.

Eski kategoriler `legacy_categories` ve satıcı kaydındaki `legacy_category` alanlarında korunur. Kaynakta bulunmayan mevsim, zaman ve koku ailesi değerleri boş başlatılır; Veri Editörü bunları elle doldurabilir.

## Sürüm etiketi

Kullanıcıya görünen sürüm her yayımlamada artırılır. `app-version` meta değeri ve alt köşedeki `v…` etiketi etkin HTML sayfalarında birlikte güncellenmelidir. Bu yayımdaki etiket `v1.0.9` olarak ayarlandı; sürüm sayfası altbilgisinde sabit konumda görünür.


Pazar filtrelerindeki kategori sayaçları her master ürün ID'sini bir kez sayar; aynı ürünün farklı satıcılardaki teklifleri sonuç listesinde korunur.


`backup/v1.0.5` dalı v1.0.5 öncesi depo durumunun hızlı geri dönüş kopyasıdır. v1.0.6 yayımlaması GitHub’da `v1.0.6` etiketiyle Release olarak işaretlenmiştir. Bu sürüm landing page ekler; `v1.0.7` Release olarak yayımlanır. `v1.0.8` ana sayfa yenilemesi geri alındı; görünüm v1.0.7’ye döndürülerek v1.0.9 olarak yayımlandı.


Geri dönüş noktası `backup/v1.0.7` dalıdır.\n\nAna giriş sayfası `index.html` landing sayfasıdır. Olfactus ve Parfümeri doğrudan açılır; önceki iki sekmeli giriş `site.html` adresinde korunur.
