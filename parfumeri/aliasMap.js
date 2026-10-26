/*!
 * aliasMap.js — Parfumeri alias (takma ad) eşleştirme sistemi
 * ---------------------------------------------------------------------------
 * Amaç: farklı satıcıların aynı parfüme verdiği farklı yazımları ("Sospiro - Vibrato",
 * "Sospiro Perfumes Vibrato", "Sospiro Vibrato" ...) tek bir standart (master) ada bağlamak.
 *
 * Nasıl çalışır?
 *  1) Aşağıdaki PZ_ALIAS_MAP sözlüğünde her master ismin altına takma adlar yazılır.
 *  2) Eşleştirme anahtarı: küçük harf + aksan/noktalama/boşluk temizliği + gürültü kelimeleri
 *     ("parfums", "perfumes", "prives") atılır. Yani "Sospiro - Vibrato" ve "sospiro  VIBRATO"
 *     takma ad yazmadan da aynı anahtarı üretir.
 *  3) Sözlükte karşılığı olan ad -> master ad + marka atanır.
 *  4) Sözlükte olmayanlar -> temel temizlik (fallback) uygulanır; sonra aynı anahtara düşen
 *     farklı yazımlar otomatik olarak tek isimde birleştirilir (en çok kullanılan yazım seçilir).
 *
 * ÖNEMLİ: EDP / EDT / Parfum / Extrait / Elixir / Intense / Le Parfum gibi konsantrasyon ve
 * versiyon ekleri BİLEREK gürültü sayılmaz; bunlar farklı ürünlerdir, birleştirilmez. Aynı ürün
 * olduklarından eminsen, takma adı aşağıya elle ekle.
 *
 * Yeni eşleşme eklemek için PZ_ALIAS_MAP'e satır ekle; başka bir yere dokunmana gerek yok.
 */
(function (global) {
  'use strict';

  /* ===================== 1) SÖZLÜK: master ad -> { brand, aliases } ===================== */
  var PZ_ALIAS_MAP = {
    'Sospiro Vibrato': { brand: 'Sospiro', aliases: [
      'Sospiro Perfumes Vibrato', 'Sospiro Perfumes - Vibrato', 'Sospiro - Vibrato', 'Sospero - Vibranto',
      'Vibrato by S. Sospiro', 'Sosp Vibra', 'SOS. VIBRATO' ]},
    'Initio Oud for Greatness': { brand: 'Initio', aliases: [
      'Initio Parfums Prives Oud for Greatness', 'Initio Parfums Privés Oud for Greatness',
      'Initio Parfums Privés - Oud for Greatness', 'Initoo - Oud Great', 'Oud For Greadness Initio' ]},
    'Initio Side Effect': { brand: 'Initio', aliases: [
      'Initio Parfums Prives Side Effect', 'Initio Parfums Privés Side Effect',
      'Initoo - Side effective', 'Init Side', 'Side Efek Initio' ]},
    'Zadig&Voltaire This Is Her': { brand: 'Zadig&Voltaire', aliases: [
      'Zadig & Voltaire This Is Her', 'Zadig Voltaire This Is Her', 'Zadig- This Is Her',
      'Zadig Her', 'Z.V. This Is Her', 'This Is Her! Zadig & Voltaire' ]},
    'Xerjoff Torino21': { brand: 'Xerjoff', aliases: [
      'Xerjoff Torino 21', 'Xerjoff - Torino 21', 'Zerkoff - Torino21', 'Xerj Torin 21' ]},
    'Xerjoff Alexandria II': { brand: 'Xerjoff', aliases: [
      'Xerjoff Alexandria 2', 'Xerjoff Alexandria-II', 'Zerkoff - Alexander 2', 'Xerj Alex II' ]},
    'Kayali Vanilla28': { brand: 'Kayali', aliases: [
      'Kayali Vanilla | 28', 'Kayali Vanilla 28', 'Kayali Fragrances Vanilla | 28', 'Kayal Vanil 28' ]},
    'Chloé Love': { brand: 'Chloé', aliases: [ 'Chloe Love', 'Chloé Love,', 'CHLO LOVE Chloé' ]},
    'Ormonde Jayne 4. Montabaco Intensivo': { brand: 'Ormonde Jayne', aliases: [
      'Ormonde Jayne Montabaco Intensivo', 'Ormonde Jayne - Montabaco Intensivo',
      'Ormonde Jayne Montobacco Intensivo', 'Ormond - Montabac', 'Orjay Montobacco' ]},
    'Clive Christian X for Men': { brand: 'Clive Christian', aliases: [
      'Clive Christian X Men', 'Clive Christian X Erkek', 'Clive Christian X', 'Cliv Cr. X men' ]},
    'Maison Crivelli Safran Secret': { brand: 'Maison Crivelli', aliases: [
      'Maison Crivelli Safran Screet', 'Safran Secret', 'Safran Screet', 'MC Safran Screet' ]}
  };

  /* ===================== 2) Normalizasyon yardımcıları ===================== */
  var NOISE = { parfums: 1, perfumes: 1, perfume: 1, prives: 1, prive: 1 };

  function fold(s) {                       /* küçük harf + aksan temizliği (index.html'deki norm ile uyumlu) */
    return String(s == null ? '' : s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  }
  function key(name) {                     /* eşleştirme anahtarı: boşluk/noktalama/gürültü yok */
    return fold(name).replace(/&/g, ' ').split(/[^a-z0-9]+/)
      .filter(function (w) { return w && !NOISE[w]; }).join('');
  }
  function clean(name) {                   /* sözlükte yoksa uygulanan temel temizlik */
    return String(name == null ? '' : name).replace(/\s+/g, ' ')
      .replace(/^[\s,;:|\/\-–—.]+|[\s,;:|\/\-–—.]+$/g, '').trim();
  }
  function noiseCount(name) {
    return fold(name).split(/[^a-z0-9]+/).filter(function (w) { return NOISE[w]; }).length;
  }

  /* ===================== 3) Sözlük indeksi (tembel) ===================== */
  var INDEX = null, BRAND_BY_MASTER = null;
  function build() {
    INDEX = {}; BRAND_BY_MASTER = {};
    var map = global.PZ_ALIAS_MAP;
    Object.keys(map).forEach(function (master) {
      var m = map[master] || {}, brand = m.brand || '';
      BRAND_BY_MASTER[master] = brand;
      [master].concat(m.aliases || []).forEach(function (a) {
        var k = key(a); if (k.length < 3) return;
        if (!INDEX[k]) INDEX[k] = { master: master, brand: brand };   /* ilk tanım kazanır */
      });
    });
  }
  function ensure() { if (!INDEX) build(); }

  /* ===================== 4) Çözümleme ===================== */
  /* Tek ad -> { name, brand, hit }  (hit = sözlükte bulundu) */
  function resolve(name) {
    ensure();
    var c = clean(name), k = key(c), h = k && INDEX[k];
    return h ? { name: h.master, brand: h.brand, hit: true } : { name: c, brand: '', hit: false };
  }
  /* Master ad -> marka (index.html'deki pzBrand bunu önce sorar; yoksa '' döner) */
  function brandOf(name) { ensure(); return BRAND_BY_MASTER[name] || ''; }
  /* Arama kutusu: yazılan şey bir takma adsa, master adın normalize halini döndür */
  function query(q) {
    ensure();
    var k = key(q), h = k.length >= 3 && INDEX[k];
    return h ? fold(h.master) : q;
  }

  /* Satıcı listesi üzerinde toplu uygulama (veri yüklendikten sonra bir kez çağrılır) */
  function apply(sellers) {
    ensure();
    var st = { total: 0, dictRenamed: 0, autoMerged: 0, cleaned: 0 }, changes = [], groups = {};
    (sellers || []).forEach(function (s) {
      (s.items || []).forEach(function (p) {
        if (!p || !p[0]) return;
        /* Merkezi katalog kimliklerinde ürün adı master kayıttan gelir; isim sözlüğü bu kimliği ezmemeli. */
        if (p._productId != null) { st.total++; return; }
        st.total++;
        if (p.orig === undefined) p.orig = String(p[0]);          /* her zaman ilk ham adı sakla */
        var r = resolve(p.orig);
        p[0] = r.name;
        if (r.hit) { if (r.name !== p.orig) { st.dictRenamed++; changes.push({ seller: s.name, from: p.orig, to: r.name, why: 'sözlük' }); } }
        else {
          if (r.name !== p.orig) st.cleaned++;
          var k = key(r.name); if (k.length < 3) return;
          var g = groups[k] || (groups[k] = { counts: {}, refs: [] });
          g.counts[r.name] = (g.counts[r.name] || 0) + 1; g.refs.push({ p: p, s: s });
        }
      });
    });
    /* Sözlükte olmayıp aynı anahtara düşen yazımları en yaygın yazımda birleştir */
    Object.keys(groups).forEach(function (k) {
      var g = groups[k], names = Object.keys(g.counts); if (names.length < 2) return;
      names.sort(function (a, b) {
        return (g.counts[b] - g.counts[a]) || (noiseCount(a) - noiseCount(b)) ||
               (a.length - b.length) || a.localeCompare(b, 'tr');
      });
      var best = names[0];
      g.refs.forEach(function (x) {
        if (x.p[0] !== best) { changes.push({ seller: x.s.name, from: x.p[0], to: best, why: 'otomatik' }); x.p[0] = best; st.autoMerged++; }
      });
    });
    api.stats = st; api.changes = changes;
    return st;
  }

  var api = { map: PZ_ALIAS_MAP, key: key, clean: clean, resolve: resolve, brandOf: brandOf, query: query,
              apply: apply, reset: function () { INDEX = null; }, stats: null, changes: [], version: 1 };
  global.PZ_ALIAS_MAP = global.PZ_ALIAS_MAP || PZ_ALIAS_MAP;   /* dışarıdan genişletilebilir */
  global.PZAlias = api;
})(typeof window !== 'undefined' ? window : globalThis);
