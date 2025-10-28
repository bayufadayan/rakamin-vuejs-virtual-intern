const ADD_PREFIX = "draft:add:";
const EDIT_PREFIX = "draft:edit-post:";

export function makeAddDraftId() {
    return String(Date.now());
}

export function addDraftKey(id) {
    return `${ADD_PREFIX}${id}`;
}
export function editDraftKey(id) {
    return `${EDIT_PREFIX}${id}`;
}

export function saveAddDraft(id, payload) {
    localStorage.setItem(addDraftKey(id), JSON.stringify({
        title: payload.title || "",
        content: payload.content || "",
        savedAt: Date.now()
    }));
}
export function getAddDraft(id) {
    const raw = localStorage.getItem(addDraftKey(id));
    return raw ? JSON.parse(raw) : null;
}
export function deleteDraftByKey(key) {
    localStorage.removeItem(key);
}

export function listDrafts() {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith(ADD_PREFIX)) {
            const d = JSON.parse(localStorage.getItem(k) || "{}");
            const id = k.replace(ADD_PREFIX, "");
            items.push({
                key: k,
                type: "add",
                id,
                title: (d.title || "(untitled)").slice(0, 80),
                savedAt: d.savedAt || 0
            });
        }
        if (k.startsWith(EDIT_PREFIX)) {
            const d = JSON.parse(localStorage.getItem(k) || "{}");
            const id = k.replace(EDIT_PREFIX, "");
            items.push({
                key: k,
                type: "edit",
                id: Number(id),
                title: (d.title || "(untitled)").slice(0, 80),
                savedAt: d.savedAt || 0
            });
        }
    }
    return items.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
}

export function clearAllDrafts() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith(ADD_PREFIX) || k.startsWith(EDIT_PREFIX))) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
}
