window.GalleryView = function() {
    const { useEffect, useState, useRef } = window.React;
    const { getCards, subscribeToCards, deleteCard } = window.Storage;
    const Card = window.Card;

    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        let unsubscribe;
        const init = async () => {
            const initialData = await getCards();
            setCards(initialData);
            unsubscribe = await subscribeToCards(setCards);
        };
        init();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    // Enable horizontal scrolling with mouse wheel
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const handleDelete = async (id) => {
        await deleteCard(id);
        setSelectedCard(null);
    };

    const filteredCards = cards.filter(card => {
        const search = filter.toLowerCase();
        return (
            card.name.toLowerCase().includes(search) || 
            card.breed.toLowerCase().includes(search) ||
            card.description.toLowerCase().includes(search)
        );
    });

    return (
        <div className="h-full flex flex-col overflow-hidden bg-cream/30">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-2 shrink-0 gap-4">
                <h2 className="text-xl font-bold text-charcoal">Collection <span className="text-gray-400 text-sm font-normal ml-1">{cards.length}</span></h2>
                <div className="relative w-40 md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-200 focus:outline-none focus:border-coral bg-white text-sm"
                    />
                    <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
                </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div 
                ref={scrollRef}
                className="flex-1 flex flex-row items-center gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-8 pb-4 no-scrollbar overscroll-contain"
            >
                {filteredCards.map(card => (
                    <div key={card.id} className="snap-center shrink-0 w-[85vw] max-w-sm h-[85%] md:h-[90%] flex flex-col">
                        <Card 
                            data={card} 
                            onClick={() => setSelectedCard(card)} 
                        />
                    </div>
                ))}
                
                {filteredCards.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center text-gray-400">
                        <div className="text-6xl mb-4 opacity-50">🐶</div>
                        <p>No dogs found.</p>
                        <p className="text-sm mt-2 opacity-70">Create some first!</p>
                    </div>
                )}
                
                {/* Spacer for right padding */}
                <div className="w-2 shrink-0"></div>
            </div>

            {/* Scroll Hint (only if cards exist) */}
            {filteredCards.length > 1 && (
                <div className="text-center pb-2 text-gray-300 text-xs animate-pulse">
                    Swipe left & right
                </div>
            )}

            {/* Modal */}
            {selectedCard && (
                <Card 
                    data={selectedCard} 
                    expanded={true} 
                    onClick={() => setSelectedCard(null)} 
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}