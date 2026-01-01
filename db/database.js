import ensureDB from './initializeDB';

export const getUserByEmail = async (email) => {
  try {
    const db = await ensureDB();
    return await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ?;',
      [email]
    );
  } catch (error) {
    console.error('[DB] Get user error:', error);
    return null;
  }
};

export const createUser = async (id, email, password) => {
  try {
    const db = await ensureDB();
    await db.runAsync(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?);',
      [id, email, password]
    );
  } catch (error) {
    console.error('[DB] Create user error:', error);
    throw error;
  }
};

export const getAddresses = async () => {
  try {
    const db = await ensureDB();
    return await db.getAllAsync('SELECT * FROM addresses;');
  } catch (error) {
    console.error('[DB] Fetch addresses error:', error);
    return [];
  }
};

export const insertAddress = async (name, email, contact) => {
  try {
    const db = await ensureDB();
    await db.runAsync(
      'INSERT INTO addresses (name, email, contact) VALUES (?, ?, ?);',
      [name, email, contact]
    );
  } catch (error) {
    console.error('[DB] Insert address error:', error);
  }
};

export const updateAddress = async (id, name, email, contact) => {
  try {
    const db = await ensureDB();
    const result = await db.runAsync(
      'UPDATE addresses SET name = ?, email = ?, contact = ? WHERE id = ?;',
      [name, email, contact, id]
    );
  } catch (error) {
    console.error('[DB] Update address error:', error);
  }
};

export const deleteAddress = async (id) => {
  try {
    const db = await ensureDB();
    const result = await db.runAsync(
      'DELETE FROM addresses WHERE id = ?;',
      [id]
    );
  } catch (error) {
    console.error('[DB] Delete address error:', error);
  }
};
