import React, { useState } from 'react';
import axios from 'axios';
// CLEANUP: Removed unused icons
import { FileText, Sparkles, Upload } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);
      const base64String = reader.result.split(',')[1];
      
      try {
        const response = await axios.post('http://127.0.0.1:8000/process-requirements', {
          file_data: base64String,
          mime_type: file.type
        });
        setResult(response.data.data);
      } catch (error) {
        setResult("Error processing file. Ensure the backend is running.");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!notes) return;
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/process-requirements', {
        text: notes,
        mime_type: "text/plain"
      });
      setResult(response.data.data);
    } catch (error) {
      setResult("Failed to connect to the BA Brain. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50' }}><Sparkles size={32} /> Auto-Scribe BA</h1>
        <p style={{ color: '#7f8c8d' }}>HR-Tech Requirements Specialist (Text • Image • Audio)</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LEFT SIDE: INPUT SECTION */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          
          <div style={{ marginBottom: '25px', padding: '15px', border: '2px dashed #3498db', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2980b9' }}><Upload size={18} /> Upload Meeting Media</h4>
            <p style={{ fontSize: '12px', color: '#7f8c8d' }}>Upload a whiteboard photo or meeting recording</p>
            <input 
              type="file" 
              accept="image/*,audio/*" 
              onChange={handleFileChange} 
              style={{ fontSize: '14px' }}
            />
          </div>

          <div style={{ textAlign: 'center', margin: '10px 0', fontWeight: 'bold', color: '#bdc3c7' }}>— OR —</div>

          <h3><FileText size={20} /> Stakeholder Notes</h3>
          <textarea 
            style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', resize: 'none' }}
            placeholder="Paste raw interview notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button 
            onClick={handleProcess}
            disabled={loading}
            style={{ width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
          >
            {loading ? "AI is Analyzing..." : "Generate from Text"}
          </button>
        </div>

        {/* RIGHT SIDE: OUTPUT SECTION */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '600px' }}>
          <h3><Sparkles size={20} color="#f1c40f" /> AI Generated Documentation</h3>
          <div style={{ whiteSpace: 'pre-wrap', color: '#34495e', lineHeight: '1.6', fontSize: '14px' }}>
            {result || "Your structured requirements will appear here after analysis..."}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;