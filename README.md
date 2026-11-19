# RONAL PROGRES

Website habit tracker bulanan. Progres bisa diisi dari desktop dan HP, dan datanya disinkronkan lewat repo GitHub kamu sendiri.

## 1. Pasang di GitHub Pages
1. Buat repo baru di GitHub, misalnya `ronal-progres` (public).
2. Upload `index.html`, `style.css`, `app.js` ke repo (Add file > Upload files).
3. Buka Settings > Pages. Pilih Source: Deploy from a branch, Branch: main, folder: / (root), lalu Save.
4. Tunggu 1 sampai 2 menit. Alamat website: `https://USERNAME.github.io/ronal-progres/`

## 2. Buat token agar data tersimpan di GitHub
1. GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token.
2. Repository access: Only select repositories, pilih repo `ronal-progres`.
3. Permissions > Repository permissions > Contents: Read and write.
4. Generate, lalu salin tokennya (hanya tampil sekali).

## 3. Hubungkan website
1. Buka website, tekan tombol **Sinkron GitHub**.
2. Isi username GitHub, nama repo, dan token. Tekan **Simpan dan sinkron**.
3. Status di bawah judul berubah menjadi "Tersimpan di GitHub ✓". Progres tersimpan di file `data.json` di repo.
4. Ulangi langkah ini di HP. Token diisi sekali per perangkat. Setiap perangkat otomatis mengambil data terbaru saat website dibuka.

## 4. Pasang di layar utama HP
- Android (Chrome): menu titik tiga > Tambahkan ke layar utama.
- iPhone (Safari): tombol Bagikan > Tambah ke Layar Utama.

## Catatan
- Kalau dua perangkat mengubah data bersamaan tanpa internet, yang terakhir disimpan yang dipakai. Buka website di satu perangkat dulu sampai muncul "Tersimpan di GitHub ✓".
- Repo public berarti `data.json` bisa dibaca orang lain. Jangan menulis hal pribadi di nama kebiasaan.
- Token hanya tersimpan di browser perangkatmu. Jangan dibagikan atau di-upload ke repo. Kalau bocor, hapus token di pengaturan GitHub.
- Tombol **Ekspor** dan **Impor** untuk cadangan data berupa file JSON.
