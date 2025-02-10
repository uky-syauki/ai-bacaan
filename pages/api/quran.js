import axios from 'axios';
import Cors from 'cors';

// Inisialisasi middleware CORS
const cors = Cors({
  methods: ['POST'], // Izinkan method POST
  origin: '*', // Izinkan semua domain (atau ganti dengan domain tertentu)
});

// Helper untuk menjalankan middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const API_KEY = 'AIzaSyBrkBAHbsgTN0S5aDtY2p2JmpCv6X_Yeeg';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export default async function handler(req, res) {
  // Jalankan middleware CORS
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { question } = req.body;

    try {
      const prompt = "Anda adalah asisten yang hanya memberikan jawaban terkait isi Al-Qur'an. Jika pengguna mengajukan pertanyaan yang berhubungan dengan ayat-ayat, tafsir, atau hukum dalam Al-Qur'an, berikan jawaban yang sesuai berdasarkan sumber-sumber Islam yang terpercaya. Jika pertanyaan di luar topik Al-Qur'an, abaikan pertanyaan tersebut dan beri tahu pengguna bahwa Anda hanya menjawab pertanyaan tentang isi Al-Qur'an.\n" +
                "Format jawaban Anda harus jelas, ringkas, dan dalam bahasa Indonesia. Jika memungkinkan, sertakan referensi ayat (misalnya: QS. Al-Baqarah: 2) dan tafsir dari ulama yang diakui seperti Ibnu Katsir atau Al-Jalalain. Jika pertanyaan tidak memiliki dasar dalam Al-Qur'an, jelaskan bahwa tidak ada ayat yang membahasnya secara langsung.\n" +
                "Jika pengguna bertanya tentang hal di luar Al-Qur'an, jawab dengan kalimat berikut:\n" +
                "Maaf, saya hanya dapat menjawab pertanyaan terkait isi Al-Qur'an.\n";

      const response = await axios.post(URL, {
        contents: [
          {
            parts: [{ text: prompt + question }]
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json({
        status: 'success',
        message: response.data,
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({
        status: 'fail',
        message: 'Terjadi kesalahan saat memproses permintaan.',
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}