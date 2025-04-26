import express from 'express';
import { SymptomAnalyzer } from './symptomAnalyzer';
import type { Request, Response } from 'express';
import { SymptomAnalysis, DoctorType } from './types';

const router = express.Router();
const symptomAnalyzer = new SymptomAnalyzer();

// POST /analyze - Analyze symptoms using Ollama
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      return res.status(400).json({
        error: 'Valid symptoms description is required'
      });
    }

    const analysis: SymptomAnalysis = await symptomAnalyzer.analyzeSymptoms(symptoms);
    
    // Ensure doctor types match your medical appointment system
    const validDoctorTypes: DoctorType[] = [
      'General Medicine',
      'Pediatrics',
      'Gynecology',
      'Dentistry',
      'Ophthalmology'
    ];

    // Sanitize doctor recommendations to match your system
    analysis.recommendedDoctorTypes = analysis.recommendedDoctorTypes.filter(
      (doctor: DoctorType) => validDoctorTypes.includes(doctor)
    );

    if (analysis.recommendedDoctorTypes.length === 0) {
      analysis.recommendedDoctorTypes = ['General Medicine'];
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({
      error: 'Failed to analyze symptoms. Please try again.'
    });
  }
});

export default router;
