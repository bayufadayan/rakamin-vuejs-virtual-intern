import readline from "readline";
import { showMenu } from "./modules/menu.js";
import { showTasks, addTask, completeTask } from "./modules/tasks.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    showMenu();
    rl.question("Pilih menu (1-4): ", (choice) => {
        switch (choice) {
            case "1":
                rl.question("Masukkan nama tugas: ", (namaTugas) => {
                    addTask(namaTugas);
                    main();
                });
                break;
            case "2":
                showTasks();
                main();
                break;
            case "3":
                showTasks();
                rl.question("Pilih nomor tugas yang selesai: ", (num) => {
                    completeTask(parseInt(num) - 1);
                    main();
                });
                break;
            case "4":
                console.log("Keluar dari aplikasi. Sampai jumpa!");
                rl.close();
                break;
            default:
                console.log("Pilihan tidak valid!");
                main();
        }
    });
}

main();
