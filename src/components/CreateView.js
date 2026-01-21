const DOG_BREEDS = [
    "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute", 
    "American Bulldog", "American Eskimo Dog", "American Foxhound", "American Staffordshire Terrier", 
    "Australian Cattle Dog", "Australian Shepherd", "Basenji", "Basset Hound", "Beagle", 
    "Bearded Collie", "Belgian Malinois", "Belgian Sheepdog", "Bernese Mountain Dog", 
    "Bichon Frise", "Bloodhound", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", 
    "Bouvier des Flandres", "Boxer", "Boykin Spaniel", "Brittany", "Brussels Griffon", 
    "Bull Terrier", "Bulldog", "Bullmastiff", "Cairn Terrier", "Canaan Dog", "Cane Corso", 
    "Cardigan Welsh Corgi", "Cavalier King Charles Spaniel", "Chesapeake Bay Retriever", 
    "Chihuahua", "Chinese Crested", "Chinese Shar-Pei", "Chow Chow", "Cocker Spaniel", 
    "Collie", "Coton de Tulear", "Dachshund", "Dalmatian", "Doberman Pinscher", 
    "Dogue de Bordeaux", "English Cocker Spaniel", "English Setter", "English Springer Spaniel", 
    "English Toy Spaniel", "Field Spaniel", "Finnish Spitz", "Flat-Coated Retriever", 
    "French Bulldog", "German Pinscher", "German Shepherd", "German Shorthaired Pointer", 
    "German Wirehaired Pointer", "Giant Schnauzer", "Golden Retriever", "Gordon Setter", 
    "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog", "Greyhound", "Harrier", 
    "Havanese", "Ibizan Hound", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", 
    "Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Keeshond", 
    "Kerry Blue Terrier", "Komondor", "Kuvasz", "Labrador Retriever", "Lagotto Romagnolo", 
    "Lakeland Terrier", "Leonberger", "Lhasa Apso", "Maltese", "Manchester Terrier", "Mastiff", 
    "Miniature American Shepherd", "Miniature Pinscher", "Miniature Schnauzer", "Neapolitan Mastiff", 
    "Newfoundland", "Norfolk Terrier", "Norwegian Elkhound", "Norwich Terrier", 
    "Old English Sheepdog", "Papillon", "Pekingese", "Pembroke Welsh Corgi", "Pharaoh Hound", 
    "Pointer", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug", "Puli", "Rat Terrier", 
    "Redbone Coonhound", "Rhodesian Ridgeback", "Rottweiler", "Saint Bernard", "Saluki", 
    "Samoyed", "Schipperke", "Scottish Deerhound", "Scottish Terrier", "Shetland Sheepdog", 
    "Shiba Inu", "Shih Tzu", "Siberian Husky", "Silky Terrier", "Soft Coated Wheaten Terrier", 
    "Staffordshire Bull Terrier", "Standard Schnauzer", "Tibetan Mastiff", "Tibetan Terrier", 
    "Toy Fox Terrier", "Vizsla", "Weimaraner", "Welsh Springer Spaniel", "Welsh Terrier", 
    "West Highland White Terrier", "Whippet", "Wire Fox Terrier", "Yorkshire Terrier"
];

const IMAGE_STYLES = [
    "Digital Painting", "Hyper Realistic", "Photorealistic", "3D Render", 
    "Concept Art", "Anime / Manga", "Cartoon / Comic Style", "Watercolor", 
    "Oil Painting", "Pencil Sketch / Line Art", "Low Poly", 
    "Isometric Illustration", "Surreal / Dreamlike", "Fantasy Art", 
    "Sci-Fi Illustration", "Minimalist", "Matte Painting", "Pixel Art"
];

window.CreateView = function({ onSaved }) {
    const { useState } = window.React;
    const { generateDogDescription, generateDogImage } = window.AI;
    const { saveCard } = window.Storage;
    const Card = window.Card;

    const [breed, setBreed] = useState(DOG_BREEDS[0]);
    const [imageStyle, setImageStyle] = useState(IMAGE_STYLES[0]);
    const [details, setDetails] = useState("");
    const [loadingStep, setLoadingStep] = useState(0); 
    const [generatedData, setGeneratedData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

    const handleGenerate = async () => {
        if (!breed) return;
        setError(null);
        setLoadingStep(1);
        setGeneratedData(null);
        setActiveTab('preview'); 

        try {
            const textData = await generateDogDescription(breed, details, imageStyle);
            setGeneratedData({ ...textData, breed, imageUrl: null });
            setLoadingStep(2);
            const imageUrl = await generateDogImage(textData.visual_prompt);
            setGeneratedData(prev => ({ ...prev, imageUrl }));
            setLoadingStep(0);
        } catch (err) {
            setError(err.message);
            setLoadingStep(0);
            setActiveTab('edit'); 
        }
    };

    const handleSave = async () => {
        if (!generatedData || !generatedData.imageUrl) return;
        setLoadingStep(3);
        try {
            await saveCard(generatedData);
            setLoadingStep(0);
            onSaved();
        } catch (err) {
            console.error(err);
            setError("Failed to save card.");
            setLoadingStep(0);
        }
    };

    return (
        <div className="h-full flex flex-col p-3 md:p-6 overflow-hidden">
            {/* Mobile Tabs - Compact */}
            <div className="md:hidden flex bg-white rounded-xl p-1 mb-3 shrink-0 shadow-sm border border-gray-100">
                <button 
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-lavender text-charcoal shadow-sm' : 'text-gray-400'}`}
                >
                    ✏️ Edit
                </button>
                <button 
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-peach text-charcoal shadow-sm' : 'text-gray-400'}`}
                >
                    🎨 Preview
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 overflow-hidden">
                
                {/* Input Section */}
                <div className={`flex-col md:flex bg-white p-4 rounded-2xl shadow-sm border border-orange-50 overflow-y-auto no-scrollbar md:w-1/2 overscroll-contain
                    ${activeTab === 'edit' ? 'flex' : 'hidden'}`}>
                    
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-3">
                            <h2 className="text-lg font-bold text-charcoal">Design Your Dog</h2>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Breed</label>
                                    <select 
                                        value={breed} 
                                        onChange={(e) => setBreed(e.target.value)}
                                        className="w-full mt-1 p-2 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral text-sm"
                                    >
                                        {DOG_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Style</label>
                                    <select 
                                        value={imageStyle} 
                                        onChange={(e) => setImageStyle(e.target.value)}
                                        className="w-full mt-1 p-2 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral text-sm"
                                    >
                                        {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                    Personality / Details
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value.slice(0, 300))}
                                    placeholder="E.g. Loves lasagna, wears a bow tie..."
                                    className="w-full h-24 md:h-32 p-3 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral resize-none text-sm placeholder-gray-400"
                                />
                                <div className="text-right text-[10px] text-gray-400 mt-1">{300 - details.length} chars left</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-50 shrink-0">
                            <button
                                onClick={handleGenerate}
                                disabled={loadingStep > 0}
                                className={`w-full py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${loadingStep > 0 ? 'bg-gray-100 text-gray-400' : 'bg-coral text-white hover:bg-orange-600'}`}
                            >
                                {loadingStep === 0 ? '✨ Generate Dog' : 'Creating Magic...'}
                            </button>
                            {error && <div className="text-red-500 text-xs text-center mt-2">{error}</div>}
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className={`flex-col md:flex items-center justify-center bg-gray-50 rounded-2xl md:w-1/2 p-4 overflow-y-auto no-scrollbar overscroll-contain
                    ${activeTab === 'preview' ? 'flex' : 'hidden'}`}>
                    
                    {loadingStep > 0 ? (
                        <div className="text-center space-y-4">
                            <div className="text-5xl animate-bounce">🦴</div>
                            <h3 className="font-bold text-coral">
                                {loadingStep === 1 && "Writing story..."}
                                {loadingStep === 2 && "Drawing dog..."}
                                {loadingStep === 3 && "Saving..."}
                            </h3>
                        </div>
                    ) : generatedData ? (
                        <div className="w-full max-w-sm space-y-3">
                            <Card data={{ ...generatedData, created_at: new Date().toISOString() }} />
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => { setGeneratedData(null); setActiveTab('edit'); }}
                                    className="flex-1 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg text-sm"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 py-2 bg-mint text-charcoal font-bold rounded-lg hover:bg-green-100 border border-green-200 text-sm"
                                >
                                    💖 Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 opacity-60">
                            <div className="text-4xl mb-2">🐾</div>
                            <p className="text-sm">Preview area</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}