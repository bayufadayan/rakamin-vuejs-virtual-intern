const ADD_KEY = "draft:add-post";
const EDIT_PREFIX = "draft:edit-post:";

export function listDrafts() {
    const items = [];
    const addRaw = localStorage.getItem(ADD_KEY);
    if (addRaw) {
        const d = JSON.parse(addRaw);
        items.push({
            key: ADD_KEY,
            type: "add",
            title: (d.title || "(untitled)").slice(0, 60),
            savedAt: d.savedAt || Date.now()
        });
    }
    
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(EDIT_PREFIX)) {
            const d = JSON.parse(localStorage.getItem(k) || "{}");
            const id = k.replace(EDIT_PREFIX, "");
            items.push({
                key: k,
                type: "edit",
                id: Number(id),
                title: (d.title || "(untitled)").slice(0, 60),
                savedAt: d.savedAt || Date.now()
            });
        }
    }
    return items.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
}

export function deleteDraft(key) { localStorage.removeItem(key); }
export function clearAllDrafts() {
    deleteDraft(ADD_KEY);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(EDIT_PREFIX)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
}
