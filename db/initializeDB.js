import * as SQLite from 'expo-sqlite';

let db = null;
let initializing = null;

const ensureDB = async () => {
  if (db) {
    return db
  };
  if (initializing) {
    return initializing
  };

  initializing = (async () => {
    try {
      const database = await SQLite.openDatabaseAsync('address.db');

      await database.runAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
      `);

      await database.runAsync(`
        CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        contact TEXT
        );
      `);

      db = database;
      return db;
    } catch (error) {
      console.error('[DB] Initialization error:', error);
      initializing = null;
      throw error;
    }
  })();

  return initializing;
};

export default ensureDB;
