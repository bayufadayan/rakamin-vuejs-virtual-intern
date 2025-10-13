let tasks = [];

export function showTasks() {
    if (tasks.length === 0) {
        console.log("Belum ada tugas.");
    } else {
        console.log("\nDaftar Tugas:");
        tasks.forEach((t, i) => {
            console.log(`${i + 1}. ${t.nama} [${t.selesai ? "✓" : "x"}]`);
        });
    }
}

export function addTask(namaTugas) {
    tasks.push({ nama: namaTugas, selesai: false });
    console.log(`Tugas "${namaTugas}" berhasil ditambahkan!`);
}

export function completeTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].selesai = true;
        console.log(`Tugas "${tasks[index].nama}" ditandai selesai ✓`);
    } else {
        console.log("Nomor tugas tidak valid.");
    }
}
