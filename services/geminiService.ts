
import { GoogleGenAI, Type } from "@google/genai";
import { Patient, AIInsight } from "../types";

// Always use a named parameter for apiKey and obtain exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClinicalInsight = async (patient: Patient, contextNote?: string): Promise<AIInsight> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like clinical analysis
  const model = 'gemini-3-pro-preview';

  const latestVitals = patient.vitals[patient.vitals.length - 1];
  const prompt = `
    Analyze the following clinical data for an emergency room patient and provide actionable insights.
    
    PATIENT DATA:
    Name: ${patient.name}
    Age: ${patient.age}
    Admission Reason: ${patient.admissionReason}
    Medical History: ${patient.history}
    Medications: ${patient.medications.join(', ')}
    Allergies: ${patient.allergies.join(', ')}
    Current Vitals (latest): HR: ${latestVitals.heartRate}, BP: ${latestVitals.systolicBP}/${latestVitals.diastolicBP}, SpO2: ${latestVitals.oxygenSaturation}%
    
    ${contextNote ? `ADDITIONAL NOTES: ${contextNote}` : ''}
    
    Provide a clinical summary, identify key risks (medication conflicts, deteriorating vitals, etc.), and suggest immediate next actions for the clinician.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyRisks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            suggestedActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            urgencyScore: { type: Type.INTEGER },
            reasoning: { type: Type.STRING }
          },
          required: ["summary", "keyRisks", "suggestedActions", "urgencyScore", "reasoning"]
        },
        systemInstruction: "You are a senior clinical decision support system. Your goal is to help ER doctors identify critical patterns and risks in fragmented data. Be concise, clinical, and high-priority."
      }
    });

    // Extract text directly from the property .text (not a method)
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Error generating AI insights. Please rely on raw clinical data.",
      keyRisks: ["System connectivity error"],
      suggestedActions: ["Consult attending physician", "Manual chart review"],
      urgencyScore: 50,
      reasoning: "The AI engine failed to process the request."
    };
  }
};
