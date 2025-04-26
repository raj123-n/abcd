import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// POST /api/symptoms/analyze
router.post('/analyze', async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
    return res.status(400).json({
      error: 'Please provide valid symptoms (at least 3 characters)'
    });
  }

  try {
    const ollamaProcess = spawn('ollama', ['run', 'mistral', symptoms]);

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      res.write(chunk);
    });

    ollamaProcess.stderr.on('data', (data) => {
      console.error(`Ollama Error: ${data}`);
      res.write(`\nError: ${data.toString()}`);
    });

    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        res.write(`\nError: Ollama process exited with code ${code}`);
      }
      res.end(); // End the response
    });

  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({
      error: 'Failed to analyze symptoms'
    });
  }
});

export default router;
