window.App = function() {
    const { useState } = window.React;
    const CreateView = window.CreateView;
    const GalleryView = window.GalleryView;

    const [view, setView] = useState('create'); // 'create' | 'gallery'

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden bg-cream">
            {/* Header */}
            <header className="bg-white shadow-sm shrink-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div 
                        className="flex items-center gap-2 cursor-pointer shrink-0" 
                        onClick={() => setView('create')}
                    >
                        <span className="text-2xl">🐶</span>
                        <h1 className="hidden sm:block text-xl font-bold tracking-tight text-charcoal">Cute Dog Cards</h1>
                        <h1 className="sm:hidden text-lg font-bold tracking-tight text-charcoal">Dog Cards</h1>
                    </div>
                    
                    <nav className="flex items-center gap-1 md:gap-4">
                        <button 
                            onClick={() => setView('create')}
                            className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-full font-semibold transition-colors
                                ${view === 'create' ? 'bg-lavender text-charcoal' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Create
                        </button>
                        <button 
                            onClick={() => setView('gallery')}
                            className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-full font-semibold transition-colors
                                ${view === 'gallery' ? 'bg-lavender text-charcoal' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Collection
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 min-h-0 relative w-full max-w-6xl mx-auto overflow-hidden">
                {view === 'create' && <CreateView onSaved={() => setView('gallery')} />}
                {view === 'gallery' && <GalleryView />}
            </main>

            {/* Footer */}
            <footer className="bg-white py-1 border-t border-gray-100 shrink-0">
                <div className="text-center text-xs text-gray-400">
                    Made with 🦴 and 🎾 by AI
                </div>
            </footer>
        </div>
    );
}