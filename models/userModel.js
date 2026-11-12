const mongoose = require('mongoose'); // Menghubungkan aplikasi dengan MongoDB

const userSchema = new mongoose.Schema({ // Membuat aturan data pengguna

  username: { // Mengatur nama pengguna
    type: String, // Username berupa teks
    required: [true, 'username wajib diisi'], // Username wajib diisi
    unique: true, // Username tidak boleh sama
    trim: true, // Menghapus spasi di awal dan akhir
    lowercase: true, // Mengubah huruf menjadi kecil
    minlength: [3, 'username minimal 3 karakter'], // Minimal 3 karakter
  },

  // select: false -> password tidak ditampilkan saat mengambil data
  password: { type: String, required: true, select: false }, // Menyimpan password pengguna dan menyembunyikannya secara default

  createdAt: { type: Date, default: Date.now }, // Menyimpan tanggal akun dibuat secara otomatis
});

module.exports = mongoose.model('User', userSchema); // Membuat dan mengekspor model User agar bisa digunakan di file lain