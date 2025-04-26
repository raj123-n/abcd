import { spawn } from 'child_process';
import { SymptomAnalysis, DoctorType } from './types';

export class SymptomAnalyzer {
  private readonly doctorTypes: DoctorType[] = [
    'General Medicine',
    'Pediatrics',
    'Gynecology',
    'Dentistry',
    'Ophthalmology'
  ];

  private async callOllama(symptoms: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const prompt = `You are a caring village doctor. A patient tells you: "${symptoms}"

Give detailed but simple advice in basic terms that anyone can understand.
Return only a JSON object like this:
{
  "severity": "medium",
  "possibleConditions": [
    "Detailed explanation of each possible condition in simple terms",
    "What this means for daily life",
    "How long it might last"
  ],
  "recommendations": [
    "Step by step what to do at home",
    "What medicines might help (but ask doctor first)",
    "What foods or activities to avoid",
    "When exactly to visit the doctor"
  ],
  "urgencyLevel": "Clear explanation of how soon to see a doctor and why",
  "recommendedDoctorTypes": ["General Medicine"]
}

Make sure each explanation is detailed but uses simple words.`;

      const ollamaProcess = spawn('ollama', ['run', 'mistral', prompt]);
      let output = '';

      ollamaProcess.stdout.on('data', (data) => {
        output += data.toString();
        try {
          const cleaned = output.replace(/\n/g, ' ').replace(/'/g, '"');
          const match = cleaned.match(/\{.*?\}/);
          if (match) {
            const json = JSON.parse(match[0]);
            if (json.severity && json.possibleConditions && json.recommendations) {
              ollamaProcess.kill();
              resolve(match[0]);
            }
          }
        } catch (error) {
          // Continue collecting output
        }
      });

      ollamaProcess.on('error', () => reject(new Error('Analysis failed')));
      
      setTimeout(() => {
        ollamaProcess.kill();
        reject(new Error('Analysis timed out'));
      }, 15000);
    });
  }

  async analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
    try {
      const response = await this.callOllama(symptoms);
      const analysis = JSON.parse(response);
      
      return {
        severity: analysis.severity?.toLowerCase() as 'low' | 'medium' | 'high' || 'medium',
        possibleConditions: analysis.possibleConditions?.slice(0, 3) || [
          "This could be a common health issue that needs proper checkup",
          "Your symptoms might be due to seasonal changes or daily stress",
          "A doctor's examination will help understand the exact cause"
        ],
        recommendations: analysis.recommendations?.slice(0, 4) || [
          "Take complete rest and avoid heavy work for now",
          "Drink plenty of warm water and eat light, healthy food",
          "Keep track of your symptoms and when they started",
          "Visit your nearest health center if you don't feel better in 2-3 days"
        ],
        urgencyLevel: analysis.urgencyLevel || 
          "If you're feeling very weak or symptoms get worse, visit the doctor today. Otherwise, rest at home and visit the health center within 2-3 days if you don't feel better.",
        recommendedDoctorTypes: ['General Medicine']
      };
    } catch (error) {
      return {
        severity: 'medium',
        possibleConditions: [
          "Your symptoms suggest you need a proper medical checkup",
          "This could be due to weather changes, work stress, or need for rest",
          "Only a doctor can tell exactly what's causing these problems"
        ],
        recommendations: [
          "First, take complete rest at home and avoid any heavy work",
          "Drink warm water frequently and eat light, easily digestible food",
          "Keep yourself in a clean, well-ventilated room",
          "Note down when each symptom started and if anything makes it better or worse"
        ],
        urgencyLevel: "If you have high fever, severe pain, or feel very weak, please visit the doctor today. If symptoms are mild, rest at home and visit the health center in 2-3 days if you don't feel better.",
        recommendedDoctorTypes: ['General Medicine']
      };
    }
  }
}
