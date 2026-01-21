window.Storage = {};

(function() {
    const COLLECTION_NAME = 'user_storage_v1';
    const room = new WebsimSocket();

    const INITIAL_DATA = {
        slot_0: [], // Cards array
        slot_1: {}, // Reserved
        slot_2: {}, // Reserved
        slot_3: {}, // Reserved
        slot_4: {}, // Reserved
        slot_5: {}, // Reserved
        slot_6: {}, // Reserved
        slot_7: {}, // Reserved
        slot_8: {}, // Reserved
        slot_9: {}, // Reserved
    };

    let cachedRecord = null;

    async function getUserRecord() {
        if (cachedRecord) return cachedRecord;

        const currentUser = await window.websim.getCurrentUser();
        
        // Filter by username to ensure we get the correct record from the DB
        // This is crucial as getList() only returns the latest records by default
        let records = await room.collection(COLLECTION_NAME).filter({username: currentUser.username}).getList();
        let userRecord = records[0];

        if (!userRecord) {
            userRecord = await room.collection(COLLECTION_NAME).create(INITIAL_DATA);
        }

        cachedRecord = userRecord;
        return userRecord;
    }

    window.Storage.getCards = async function() {
        // Ensure we have a record to work with
        const record = await getUserRecord();
        return record.slot_0 || [];
    };

    window.Storage.saveCard = async function(cardData) {
        const record = await getUserRecord();
        
        const newCard = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...cardData
        };

        const currentCards = record.slot_0 || [];
        const updatedCards = [newCard, ...currentCards];

        await room.collection(COLLECTION_NAME).update(record.id, {
            slot_0: updatedCards
        });
        
        cachedRecord.slot_0 = updatedCards;
        return newCard;
    };

    window.Storage.deleteCard = async function(cardId) {
        const record = await getUserRecord();
        const currentCards = record.slot_0 || [];
        const updatedCards = currentCards.filter(c => c.id !== cardId);

        await room.collection(COLLECTION_NAME).update(record.id, {
            slot_0: updatedCards
        });

        cachedRecord.slot_0 = updatedCards;
        return true;
    };

    window.Storage.subscribeToCards = async function(callback) {
        const currentUser = await window.websim.getCurrentUser();
        
        // Subscribe specifically to the user's record
        const unsubscribe = room.collection(COLLECTION_NAME).filter({username: currentUser.username}).subscribe((records) => {
            if (records && records.length > 0) {
                const myRecord = records[0];
                cachedRecord = myRecord;
                callback(myRecord.slot_0 || []);
            } else {
                callback([]);
            }
        });

        return unsubscribe;
    };
})();