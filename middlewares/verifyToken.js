const jwt = require('jsonwebtoken'); // Mengambil alat untuk memeriksa token
const { errorHttp } = require('./errorHandler'); // Mengambil alat untuk menampilkan error

function verifyToken(req, res, next) { // Membuat fungsi untuk memeriksa token pengguna

  const [skema, token] = (req.headers.authorization || '').split(' '); 
  // Mengambil token yang dikirim pengguna

  if (skema !== 'Bearer' || !token) {
    throw errorHttp(401, 'Token tidak ditemukan'); // Menolak jika token tidak ada
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    // Memeriksa apakah token benar dan masih berlaku

    next(); // Jika token benar, pengguna boleh melanjutkan

  } catch (err) {
    // Jika token salah atau sudah kedaluwarsa

    const pesan = err.name === 'TokenExpiredError' ? 'Token kedaluwarsa' : 'Token tidak valid';
    // Menentukan pesan kesalahan

    throw errorHttp(401, pesan); // Menampilkan pesan error
  }
}

module.exports = verifyToken; // Mengirim fungsi agar bisa digunakan di file lain