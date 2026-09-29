// GANTI DENGAN API KEY MAPTILER ANDA
const API_KEY = 'https://api.maptiler.com/maps/streets-v4/?key=YOUR_MAPTILER_API_KEY_HERE#1.0/0.00000/0.00000YOUR_MAPTILER_API_KEY'; 

async function cariLokasi() {
    const inputLokasi = document.getElementById('input-lokasi').value;
    const resultCard = document.getElementById('result-card');
    const errorMessage = document.getElementById('error-message');
    
    // Reset tampilan
    resultCard.style.display = 'none';
    errorMessage.textContent = '';

    if (!inputLokasi) {
        errorMessage.textContent = 'Harap masukkan nama lokasi terlebih dahulu!';
        return;
    }

    try {
        // Menggunakan endpoint geocoding MapTiler
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(inputLokasi)}.json?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari API');
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const lokasi = data.features[0];
            
            // Ekstrak koordinat
            const lon = lokasi.center[0];
            const lat = lokasi.center[1];
            
            // Ekstrak konteks lokasi (Negara, Provinsi, dll)
            let negara = "Tidak ditemukan";
            let provinsi = "Tidak ditemukan";
            let kecamatan = "Tidak ditemukan";

            if (lokasi.context) {
                lokasi.context.forEach(ctx => {
                    if (ctx.id.startsWith('country')) negara = ctx.text;
                    if (ctx.id.startsWith('region') || ctx.id.startsWith('province')) provinsi = ctx.text;
                    if (ctx.id.startsWith('subregion') || ctx.id.startsWith('municipality') || ctx.id.startsWith('county')) kecamatan = ctx.text;
                });
            }

            // Jika lokasi utama adalah salah satunya, atur ulang agar lebih akurat
            if (lokasi.place_type.includes('country')) negara = lokasi.text;
            if (lokasi.place_type.includes('region')) provinsi = lokasi.text;

            // Tampilkan ke HTML
            document.getElementById('res-negara').textContent = negara;
            document.getElementById('res-provinsi').textContent = provinsi;
            document.getElementById('res-kecamatan').textContent = kecamatan;
            document.getElementById('res-lon').textContent = lon;
            document.getElementById('res-lat').textContent = lat;

            resultCard.style.display = 'block';
        } else {
            errorMessage.textContent = 'Lokasi tidak ditemukan. Coba kata kunci lain.';
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = 'Terjadi kesalahan jaringan atau API Key tidak valid.';
    }
}