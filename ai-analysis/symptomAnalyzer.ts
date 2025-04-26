import { spawn } from 'child_process';
import axios from 'axios';
import { SymptomAnalysis, DoctorType, Severity } from './types';

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
      const prompt = `
        As a medical AI assistant, analyze these symptoms and provide a structured analysis.
        Consider these available doctor types: ${this.doctorTypes.join(', ')}.
        
        Format your response EXACTLY as JSON with this structure:
        {
          "severity": "low/medium/high",
          "possibleConditions": ["condition1", "condition2"],
          "recommendations": ["recommendation1", "recommendation2"],
          "urgencyLevel": "description of urgency",
          "recommendedDoctorTypes": ["doctor type 1", "doctor type 2"]
        }

        Symptoms: ${symptoms}

        Rules:
        1. recommendedDoctorTypes must ONLY include values from the available types listed above
        2. severity must ONLY be "low", "medium", or "high"
        3. Include at least 2 recommendations
        4. Make urgencyLevel clear and actionable
        5. If symptoms are severe, recommend immediate medical attention
      `;

      const apiUrl = 'http://127.0.0.1:11434/api/generate'; // Assuming the default Ollama API endpoint
      const requestBody = {
        model: 'gemma3:1b',
        prompt: prompt,
        stream: false, // Set to true if you want to stream the response
      };

      axios.post(apiUrl, requestBody)
        .then((response: any) => { // TODO: Add proper type for response
          resolve(response.data.response.trim()); // Adjust based on the API response structure
        })
        .catch((error: any) => { // TODO: Add proper type for error
          console.error('Ollama API Error:', error);
          reject(new Error(`Ollama API request failed: ${error.message}`));
        });
    });
  }

  async analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
    try {
      const response = await this.callOllama(symptoms);
      try {
        const analysis = JSON.parse(response);
        
        // Validate and sanitize the response
        const sanitizedAnalysis: SymptomAnalysis = {
          severity: this.validateSeverity(analysis.severity),
          possibleConditions: this.sanitizeArray(analysis.possibleConditions),
          recommendations: this.sanitizeArray(analysis.recommendations),
          urgencyLevel: analysis.urgencyLevel || 'Please consult a healthcare professional',
          recommendedDoctorTypes: this.validateDoctorTypes(analysis.recommendedDoctorTypes)
        };

        return sanitizedAnalysis;
      } catch (error) {
        console.error('Error parsing Ollama response:', error);
        throw new Error('Failed to parse AI analysis response');
      }
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  private validateSeverity(severity: string): Severity {
    const validSeverities: Severity[] = ['low', 'medium', 'high'];
    const normalized = severity?.toLowerCase() as Severity;
    return validSeverities.includes(normalized) ? normalized : 'medium';
  }

  private validateDoctorTypes(types: string[]): DoctorType[] {
    if (!Array.isArray(types)) return ['General Medicine'];
    return types
      .filter((type): type is DoctorType => 
        this.doctorTypes.includes(type as DoctorType)
      );
  }

  private sanitizeArray(arr: string[]): string[] {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => typeof item === 'string' && item.trim().length > 0);
  }
}
