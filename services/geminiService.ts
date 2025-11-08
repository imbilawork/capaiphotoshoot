
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateImage = async (
  logoDesc: string,
  capStyle: string,
  capColor: string,
  logoApp: string,
  background: string
): Promise<string> => {
  const prompt = `Professional product photoshoot of a single ${capColor} ${capStyle} on a clean surface. The cap features a custom logo on the front. The logo is a "${logoDesc}". The logo is applied as a realistic ${logoApp}. The cap is set against a ${background} background. The image must be photorealistic, with cinematic lighting, high resolution, and sharp focus on the cap and its logo.`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check your prompt and API key.");
  }
};


export const editImage = async (
  base64ImageData: string,
  prompt: string
): Promise<string> => {
    const base64Data = base64ImageData.split(',')[1];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg',
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
          });

          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
          }
          throw new Error("Image editing failed, no image data in response.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image.");
    }
};
