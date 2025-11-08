
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import OptionSelector from './components/OptionSelector';
import Spinner from './components/Spinner';
import { CAP_STYLES, CAP_COLORS, LOGO_APPLICATIONS, BACKGROUND_THEMES } from './constants';
import { generateImage, editImage } from './services/geminiService';
import { Option } from './types';

const App: React.FC = () => {
  const [logoDescription, setLogoDescription] = useState('A minimalist geometric wolf head');
  const [capStyle, setCapStyle] = useState<string>(CAP_STYLES[0].id);
  const [capColor, setCapColor] = useState<string>(CAP_COLORS[0].id);
  const [logoApplication, setLogoApplication] = useState<string>(LOGO_APPLICATIONS[0].id);
  const [backgroundTheme, setBackgroundTheme] = useState<string>(BACKGROUND_THEMES[0].id);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const findNameById = (options: Option[], id: string) => options.find(o => o.id === id)?.name || id;

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const capStyleName = findNameById(CAP_STYLES, capStyle);
    const capColorName = findNameById(CAP_COLORS, capColor);
    const logoAppName = findNameById(LOGO_APPLICATIONS, logoApplication);
    const backgroundName = findNameById(BACKGROUND_THEMES, backgroundTheme);

    try {
      const imageUrl = await generateImage(logoDescription, capStyleName, capColorName, logoAppName, backgroundName);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [logoDescription, capStyle, capColor, logoApplication, backgroundTheme]);

  const handleEdit = useCallback(async () => {
    if (!generatedImage || !editPrompt.trim()) return;

    setIsEditing(true);
    setError(null);
    try {
        const editedImageUrl = await editImage(generatedImage, editPrompt);
        setGeneratedImage(editedImageUrl);
        setEditPrompt('');
    } catch (err: any) {
        setError(err.message || 'An unknown error occurred during editing.');
    } finally {
        setIsEditing(false);
    }
  }, [generatedImage, editPrompt]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      {isLoading && <Spinner message="Generating your photoshoot..." />}
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="space-y-4">
                <div>
                    <label htmlFor="logo-desc" className="block text-lg font-semibold text-white mb-2">
                        1. Describe Your Logo
                    </label>
                    <input
                        id="logo-desc"
                        type="text"
                        value={logoDescription}
                        onChange={(e) => setLogoDescription(e.target.value)}
                        placeholder="e.g., A roaring lion head"
                        className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    />
                </div>

                <OptionSelector title="2. Cap Style" options={CAP_STYLES} selectedValue={capStyle} onSelect={setCapStyle} />
                <OptionSelector title="3. Cap Color" options={CAP_COLORS} selectedValue={capColor} onSelect={setCapColor} />
                <OptionSelector title="4. Logo Application" options={LOGO_APPLICATIONS} selectedValue={logoApplication} onSelect={setLogoApplication} />
                <OptionSelector title="5. Background Theme" options={BACKGROUND_THEMES} selectedValue={backgroundTheme} onSelect={setBackgroundTheme} />
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-8 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg flex items-center justify-center"
            >
                {isLoading ? 'Generating...' : 'Generate Photoshoot'}
            </button>
          </div>

          {/* Image/Result Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[50vh] lg:min-h-0">
             {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
             
             {!generatedImage && !isLoading && (
                 <div className="text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="mt-2">Your generated image will appear here.</p>
                 </div>
             )}

             {generatedImage && (
                <div className="w-full">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-700">
                        <img src={generatedImage} alt="Generated cap photoshoot" className="w-full h-full object-cover"/>
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="edit-prompt" className="block text-md font-semibold text-white mb-2">Edit Image</label>
                         <div className="flex gap-2">
                             <input
                                 id="edit-prompt"
                                 type="text"
                                 value={editPrompt}
                                 onChange={(e) => setEditPrompt(e.target.value)}
                                 placeholder="e.g., 'Make the lighting more dramatic'"
                                 className="flex-grow bg-gray-700 border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                             />
                             <button
                                onClick={handleEdit}
                                disabled={isEditing || !editPrompt.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                             >
                                 Apply
                             </button>
                         </div>
                    </div>
                     <a
                        href={generatedImage}
                        download="cap-photoshoot.jpg"
                        className="w-full block text-center mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300"
                    >
                        Download Image
                    </a>
                </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
