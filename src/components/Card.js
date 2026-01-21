window.Card = function({ data, expanded = false, onClick, onDelete }) {
    const React = window.React;
    const { name, breed, description, imageUrl, created_at } = data;
    
    const dateStr = new Date(created_at).toLocaleDateString();

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.currentTarget;
        const originalText = btn.innerText;
        btn.innerText = "Preparing...";
        btn.disabled = true;

        try {
            // Fetch the image as a blob
            // Using a cache-buster can help with some browser CORS caching quirks
            const fetchUrl = imageUrl.includes('?') ? `${imageUrl}&t=${Date.now()}` : `${imageUrl}?t=${Date.now()}`;
            const response = await fetch(fetchUrl, {
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            // Clean filename: remove special characters, replace spaces with underscores
            const safeName = name.replace(/[^\w\s-]/gi, '').trim().replace(/\s+/g, '_');
            link.download = `${safeName}_dog_card.png`;
            
            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Release the blob URL after a short delay
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
            console.error('Blob download failed:', err);
            // Fallback: standard anchor download attribute (might still open in new tab if CORS prevents blob)
            const link = document.createElement('a');
            link.href = imageUrl;
            link.target = "_blank";
            link.download = `${name.replace(/\s+/g, '_')}_card.png`;
            link.click();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };

    if (expanded) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClick}>
                <div 
                    className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all scale-100" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative shrink-0">
                        <img src={imageUrl} alt={name} className="w-full h-64 md:h-80 object-cover bg-lavender" />
                        <button 
                            onClick={onClick}
                            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-charcoal font-bold shadow-sm"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-4 md:p-6 overflow-y-auto">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-charcoal">{name}</h3>
                                <span className="inline-block bg-peach text-xs font-semibold px-2 py-1 rounded-full text-charcoal mt-1">
                                    {breed}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{dateStr}</span>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 font-serif leading-relaxed mb-6">
                            {description}
                        </p>
                        
                        <div className="flex gap-3 mt-auto">
                            <button 
                                onClick={handleDownload}
                                className="flex-1 bg-coral text-white py-2 md:py-3 rounded-lg font-bold text-center text-sm md:text-base hover:bg-orange-600 transition-colors shadow-sm"
                            >
                                Download Art
                            </button>
                            {onDelete && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if(confirm('Woof? Are you sure you want to delete this card?')) onDelete(data.id);
                                    }}
                                    className="px-4 py-2 border-2 border-gray-200 text-gray-400 rounded-lg hover:border-red-300 hover:text-red-400 transition-colors"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Thumbnail view
    return (
        <div 
            onClick={onClick}
            className="h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-peach group flex flex-col"
        >
            <div className="aspect-square w-full shrink-0 overflow-hidden bg-lavender relative">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="p-4 flex flex-col flex-1 min-h-0">
                <h3 className="font-bold text-lg text-charcoal truncate shrink-0">{name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 shrink-0">{breed}</p>
                <div className="flex-1 overflow-hidden relative">
                    <p className="text-sm text-gray-600 font-serif absolute inset-0 line-clamp-6 md:line-clamp-8 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}