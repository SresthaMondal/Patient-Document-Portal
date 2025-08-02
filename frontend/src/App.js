import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDocs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/documents');
      setDocs(res.data);
    } catch (err) {
      setMessage('⚠️ Unable to fetch documents.');
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const upload = async () => {
    if (!file || file.type !== 'application/pdf') {
      setMessage('⚠️ Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/documents/upload', formData);
      setMessage('✅ File uploaded successfully!');
      setFile(null);
      fetchDocs();
    } catch {
      setMessage('❌ Upload failed.');
    }
  };

  const deleteDoc = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/documents/${id}`);
      fetchDocs();
    } catch {
      setMessage('❌ Deletion failed.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📁 Patient Document Portal</h1>

        <div className="upload-card">
          <label htmlFor="pdf-upload">📄 Select PDF</label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <p
            className="file-name"
            title={file ? file.name : 'No file selected'}
          >
            📄 {file ? `Selected: ${file.name}` : 'No file selected'}
          </p>

          <button onClick={upload}>⬆️ Upload</button>
          {message && <p className="message">{message}</p>}
        </div>

        <h2 className="doc-title">📚 Uploaded Documents</h2>
        <div className="doc-grid">
          {docs.length === 0 ? (
            <p className="empty-msg">No documents uploaded yet.</p>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="doc-card">
                <h4>{doc.original_filename}</h4>
                <p>{(doc.filesize / 1024).toFixed(1)} KB</p>
                <div className="doc-actions">
                  <button
                    onClick={() =>
                      window.open(`http://localhost:5000/documents/${doc.id}`)
                    }
                  >
                    ⬇️ Download
                  </button>
                  <button onClick={() => deleteDoc(doc.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
