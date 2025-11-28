import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD2U00k2_MMpDaAVtT61QCfBrbWgTMuLao");

export const generateSalesAnalysis = async (salesData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a business analyst for a salon. Analyze the following sales data and provide insights:

Sales Data:
${JSON.stringify(salesData, null, 2)}

Please provide:
1. Overall sales performance summary
2. Top selling services/products
3. Revenue trends
4. Customer behavior insights
5. Actionable recommendations for improvement

Keep the analysis concise and focused on actionable insights.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    throw error;
  }
};

export const generateInventoryInsights = async (products) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an inventory manager for a salon. Analyze this inventory data:

Products:
${JSON.stringify(products, null, 2)}

Provide:
1. Low stock warnings
2. Overstocked items
3. Reorder recommendations
4. Cost optimization suggestions

Keep it brief and actionable.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating inventory insights:", error);
    throw error;
  }
};

export default genAI;
