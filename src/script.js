// script.js
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
export const commonMedicines = [
  "Paracetamol", "Ibuprofen", "Amoxicillin", "Cetirizine", "Azithromycin",
  "Metformin", "Omeprazole", "Pantoprazole", "Dolo 650", "Aspirin",
  "Atorvastatin", "Amlodipine", "Losartan", "Ciprofloxacin", "Levofloxacin",
  "Crocin", "Allegra", "Augmentin", "Benadryl", "Calpol", "Dexamethasone",
  "Montelukast", "Diclofenac", "Ranitidine", "Clopidogrel"
];

export const fetchMedicineInfo = async (medicineName) => {
  const prompt = `Provide a highly structured and professional medical overview for: ${medicineName}. 
  Strictly include these sections:
  1. Primary Uses
  2. Mechanism of Action (How it works)
  3. Common Side Effects
  4. Important Precautions/Warnings
  Format the output using clear markdown headings and bullet points.`;
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // The updated, stable model
        messages: [
          { role: "system", content: "You are a highly accurate pharmaceutical AI assistant. Provide concise, factual, and strictly informational medical data. Warn users to consult a doctor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2 
      })
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Groq Server Error Details:", errorDetails);
        throw new Error(`API Error ${response.status}: ${errorDetails.error?.message || 'Bad Request'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};