# Pazar sekmesi: satıcı özeti ve "Detaylı bilgi" değişikliği

## Değişen dosya
- `index.html` (sistemde yüklü sürüm olan `index_1.html` üzerinden hazırlandı)

Veri dosyalarına (`*.json`, `index.json`) dokunulmadı. Sadece Pazar sekmesindeki satıcı bloğunun görünümü değişti.

## Yeni görünüm
- **Satıcı adının altı:** Yalnızca kampanyalar madde madde listeleniyor. İndirimler önce, hediyeler sonra. En fazla 3 madde. Fazlası "+ N kampanya daha, detaylı bilgide" satırına dönüşüyor.
- **Kargo:** Kargo kampanyaları (ücretsiz kargo vb.) özette yer almıyor, yalnızca detaylı bilgide görünüyor.
- **Detaylı bilgi düğmesi:** Özetin hemen altında. Uzun metin (hacim seçenekleri, politika, kargo, sepet kampanyası, not, "Siteyi aç") tüm satıcılarda varsayılan olarak gizli.
- **Aç / gizle:** Düğme açınca "Gizle"ye dönüşüyor. Uzun bloğun en altında ayrıca bir "Gizle" düğmesi var. Alttaki düğmeyle kapatınca sayfa üstteki düğmeye hizalanıyor, yukarı kaydırmak gerekmiyor.
- **Durum korunması:** Arama kutusuna yazınca liste yeniden çizilse bile her satıcının açık/kapalı durumu korunuyor.
- **Veri çekilemedi:** Ürünü olmayan satıcıda uyarı açıkta görünmeye devam ediyor.
- **Siteyi aç:** Detaylı bilginin içine alındı. Ürün kartlarındaki "Sitede aç" aynen duruyor.
- **Barroni:** Aynı yapıya geçti. Kampanya verisi olmadığı için özet boş, yalnızca düğme görünüyor.

## Özet nereden geliyor
1. Satıcının `campaigns` listesi varsa onun etiketleri kullanılır. Etiket yoksa türden metin üretilir (örneğin `nthPercent` → "2. ürüne %50 indirim", `buyXPayY` → "5 ve 10 ml setlerde 5 AL 4 ÖDE"). Türü kargo olan veya etiketinde "kargo" geçen kampanyalar atlanır.
2. `campaigns` yoksa `policy` metninden "al öde", "%", "indirim" ve "hediye" geçen cümleler ayıklanır. Parantez içi açıklamalar atılır. Cümleler `.`, `;` ve ` + ` işaretlerinden bölünür. "1. parfümde" gibi sıra numaraları bölünmez.
3. Kargo geçen cümleler ve esans/extrait oranı gibi kampanya olmayan ifadeler ("%25 esans oranı", "Likit parfümler %35–40 Extrait") elenir.
4. Hiç kampanya bulunamazsa özet boş kalır, yalnızca düğme görünür.

## Teknik not
- Kod değişiklikleri: yeni stil kuralları, `pzCampLabel`, `pzCampList` ve `pzDetUi` fonksiyonları, `renderSellers` ile Barroni bloğunun yeni yapıya geçirilmesi, açma/gizleme için tıklama dinleyicisi.
- Açık/kapalı durum `PZ_DET` nesnesinde satıcı adresine göre tutuluyor. Sayfa yenilenince sıfırlanır (varsayılan: gizli).

## Gerçek verilerle sonuç (kontrol)
- Özet çıkan satıcılar: Barroni, Ekartiz, Emre Boslu, Famak de Fragancia, Hanesans, İmza Kimya, Malikhan, Membara, MFY, Scentface, Valerio Bacio, Viadora.
- Özeti boş kalan satıcılar: Capslock, Emre Geldi, Parfüm Mutfağı, Patronus. Bunların politika metninde kampanya yok, yalnızca kargo bilgisi veya "doğrulanamadı" yazıyor.
