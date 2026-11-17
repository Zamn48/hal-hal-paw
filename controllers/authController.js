const bcrypt = require('bcrypt'); // Alat untuk mengamankan password
const jwt = require('jsonwebtoken'); // Alat untuk membuat token login
const User = require('../models/userModel'); // Mengambil aturan data pengguna
const { errorHttp } = require('../middlewares/errorHandler'); // Mengambil fungsi untuk menampilkan error

const SALT_ROUNDS = 10; // Tingkat pengamanan password
const PASSWORD_MIN = 8; // Password minimal 8 karakter
const PASSWORD_MAKS_BYTE = 72; // Password maksimal 72 byte

exports.register = async (req, res) => { // Fungsi untuk membuat akun baru
    
  const { username, password } = req.body; // Mengambil username dan password yang dimasukkan pengguna

  if (typeof password !== 'string' || password.length < PASSWORD_MIN) { // Mengecek apakah password sudah benar dan minimal 8 karakter
    throw errorHttp(400, `password wajib diisi, minimal ${PASSWORD_MIN} karakter`); // Memberi pesan error jika password kurang dari 8 karakter
  }

  if (Buffer.byteLength(password) > PASSWORD_MAKS_BYTE) { // Mengecek apakah password terlalu panjang
    throw errorHttp(400, `password maksimal ${PASSWORD_MAKS_BYTE} byte`); // Memberi pesan error jika password lebih dari 72 byte
  }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  // role TIDAK diambil dari req.body: akun hasil register selalu 'user'
  const user = await User.create({ username, password: hashed });
  res.status(201).json({ id: user._id, username: user.username, role: user.role });
};

exports.login = async (req, res) => { // Membuat fungsi untuk proses login pengguna

  const { username, password } = req.body; // Mengambil username dan password yang dimasukkan pengguna

  // Mengecek apakah username dan password berupa teks
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw errorHttp(400, 'username dan password wajib diisi'); // Menampilkan error jika username atau password tidak sesuai
  }

  const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+password'); // Mencari username di database dan mengambil password pengguna

  const cocok = user ? await bcrypt.compare(password, user.password) : false; // Mengecek apakah password yang dimasukkan cocok dengan password di database

  // Pesan dibuat sama agar orang lain tidak tahu username yang terdaftar
  if (!cocok) throw errorHttp(401, 'Username atau password salah'); // Menampilkan pesan jika username atau password salah

    const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  res.json({ token }); // Mengirim token kepada pengguna setelah berhasil login
};
// Contoh endpoint yang membaca data pengguna dari token

exports.me = (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role, berlakuSampai: new Date(req.user.exp * 1000) });
};