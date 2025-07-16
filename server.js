const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read JSON files
const readJSONFile = (filename) => {
  try {
    const filePath = path.join(__dirname, 'public', 'json', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// API Routes
app.get('/api/info', (req, res) => {
  const info = readJSONFile('info.json');
  if (info) {
    res.json(info);
  } else {
    res.status(500).json({ error: 'Failed to load info data' });
  }
});

app.get('/api/languages', (req, res) => {
  const languages = readJSONFile('languages.json');
  if (languages) {
    res.json(languages);
  } else {
    res.status(500).json({ error: 'Failed to load languages data' });
  }
});

app.get('/api/services', (req, res) => {
  const services = readJSONFile('services.json');
  if (services) {
    res.json(services);
  } else {
    res.status(500).json({ error: 'Failed to load services data' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

