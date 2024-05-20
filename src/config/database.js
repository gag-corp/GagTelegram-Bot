import fs from 'fs';
import { JSONFile, Low } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbConfig = (fileName) => {
    const file = join(dataDir, fileName);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    return db;
};

export const initializeDatabases = async () => {
    const usersdb = dbConfig('usersdb.json');
    await usersdb.read();
    usersdb.data ||= { users: [], flexPlayers: [], r6Players: [], programmers: [] };
    await usersdb.write();

    const flexFila = dbConfig('flexFila.json');
    await flexFila.read();
    await flexFila.write();

    const r6Fila = dbConfig('r6Fila.json');
    await r6Fila.read();
    await r6Fila.write();

    const naoMarca = dbConfig('naoMarca.json');
    await naoMarca.read();
    await naoMarca.write();

    const dbIdea = dbConfig('ideias.json');
    await dbIdea.read();
    dbIdea.data ||= { ideias: [] };
    await dbIdea.write();

    return { usersdb, flexFila, r6Fila, naoMarca, dbIdea };
};
