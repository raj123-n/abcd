export type DoctorType = 'General Medicine' | 'Pediatrics' | 'Gynecology' | 'Dentistry' | 'Ophthalmology';
export type Severity = 'low' | 'medium' | 'high';

export interface SymptomAnalysis {
  severity: Severity;
  possibleConditions: string[];
  recommendations: string[];
  urgencyLevel: string;
  recommendedDoctorTypes: DoctorType[];
}
