export function generateDummyPosts(count = 25) {
    const nouns = ["Vue", "State", "Router", "Component", "Mutation", "Action", "Getter", "Module", "Hook", "Render"];
    const verbs = ["membantu", "mengelola", "menyederhanakan", "meningkatkan", "mengatur", "menghubungkan", "mengubah", "menyimpan", "menampilkan", "merender"];
    const adjs = ["cepat", "stabil", "mudah", "rapi", "modular", "fleksibel", "aman", "ringan", "powerful", "reusable"];

    const rand = arr => arr[Math.floor(Math.random() * arr.length)];
    const sentence = () => `${rand(nouns)} ${rand(verbs)} UI yang ${rand(adjs)}.`;
    const paragraph = () =>
        Array.from({ length: 3 }, () => sentence()).join(" ");

    const now = Date.now();
    return Array.from({ length: count }, (_, i) => ({
        id: now + i,
        title: `${rand(nouns)} ${rand(verbs)} (${i + 1})`,
        content: `${paragraph()}\n\n${paragraph()}`,
        createdAt: new Date(now - Math.floor(Math.random() * 3600 * 24 * 365 * 1000)).toISOString() // acak dalam 1 tahun
    }));
}
