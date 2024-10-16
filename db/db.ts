// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('database.db', { verbose: console.log });

// Crear tabla Employee si no existea
const createEmployeeTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS Employee (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL
  )
`);
createEmployeeTable.run();

// Crear tabla Projects si no existe
const createProjectsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS Projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )
`);
createProjectsTable.run();

// Crear tabla Task si no existe
const createTaskTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS Task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    start_date DATE,
    stimated_days INTEGER,
    state INTEGER,
    employee TEXT,
    project TEXT,
    FOREIGN KEY (employee) REFERENCES Employee(id),
    FOREIGN KEY (project) REFERENCES Projects(id)
  )
`);
createTaskTable.run();

export default db;
