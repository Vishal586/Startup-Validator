const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT_TEMPLATE = (title, description) => `
You are an expert startup consultant with 20+ years of experience advising early-stage companies.
Analyze the given startup idea and return a structured JSON object with EXACTLY these fields:
- problem: A concise 2-3 sentence description of the core problem being solved
- customer: The ideal customer persona (demographics, behavior, pain points) in 2-3 sentences
- market: Brief market size and growth overview (TAM/SAM/SOM if possible) in 2-3 sentences
- competitors: An array of EXACTLY 3 competitor objects, each with "name" and "differentiation" (one-line how this idea differs)
- tech_stack: An array of 4-6 practical technologies recommended for MVP (strings only)
- risk_level: Exactly one of "Low", "Medium", or "High"
- profitability_score: An integer between 0 and 100 representing profit potential
- justification: 3-4 sentences explaining the risk level and profitability score

Rules:
- Be concise, realistic, and data-driven
- Focus on practical, achievable MVP scope
- Return ONLY valid JSON, no markdown fences, no preamble

Input: ${JSON.stringify({ title, description })}
`;

const analyzeIdea = async (title, description) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
            },
        });

        const result = await model.generateContent(PROMPT_TEMPLATE(title, description));
        const raw = result.response.text().trim();

        // Strip any accidental markdown fences
        const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

        const report = JSON.parse(cleaned);

        // Validate required fields
        const requiredFields = [
            "problem", "customer", "market", "competitors",
            "tech_stack", "risk_level", "profitability_score", "justification",
        ];

        for (const field of requiredFields) {
            if (report[field] === undefined || report[field] === null) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Ensure competitors is array of 3
        if (!Array.isArray(report.competitors) || report.competitors.length !== 3) {
            throw new Error("competitors must be an array of exactly 3 items");
        }

        // Ensure tech_stack is array
        if (!Array.isArray(report.tech_stack)) {
            throw new Error("tech_stack must be an array");
        }

        // Clamp profitability score
        report.profitability_score = Math.max(0, Math.min(100, parseInt(report.profitability_score)));

        return report;
    } catch (err) {
        if (err.name === "SyntaxError") {
            throw new Error("AI returned invalid JSON. Please try again.");
        }
        // Handle Gemini specific errors
        if (err.status === 429) {
            throw new Error("Gemini rate limit reached. Please try again in a moment.");
        }
        if (err.status === 401 || err.status === 403) {
            throw new Error("Invalid Gemini API key. Please check your .env file.");
        }
        if (err.status === 500) {
            throw new Error("Gemini service error. Please try again in a moment.");
        }
        throw err;
    }
};

module.exports = { analyzeIdea };