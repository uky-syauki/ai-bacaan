import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/quran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error('Terjadi kesalahan saat memproses permintaan.');
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk memformat teks
  const formatText = (text) => {
    return text
      .replace(/\n/g, '<br />') // Ganti newline dengan <br />
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Ganti **teks** dengan <strong>teks</strong>
      .replace(/\*(.*?)\*/g, '<li>$1</li>'); // Ganti * dengan <li>
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Basis Al-Qur'an</h1>
      <p className={styles.description}>
        Ajukan pertanyaan Anda tentang Al-Qur'an dan dapatkan analisis mendalam dari AI.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Masukkan pertanyaan Anda"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Kirim'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {response && (
        <div className={styles.response}>
          <h2 className={styles.responseTitle}>Hasil Ai:</h2>
          <div className={styles.card}>
            <div
              dangerouslySetInnerHTML={{
                __html: formatText(
                  response['message']['candidates'][0]['content']['parts'][0]['text']
                ),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}