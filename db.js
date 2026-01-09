const { MongoClient } = require('mongodb');
require('dotenv').config();

//const uri = process.env.MONGO_URI
//const client = new MongoClient(uri, {
//  serverSelectionTimeoutMS: 5000,
//  tls: true,
//  tlsAllowInvalidCertificates: true,
//  tlsAllowInvalidHostnames: true,
// });

let db;

async function connectDB() {
    console.log("MongoDB connection skipped (temporary)");

}

function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

module.exports = { connectDB, getDB };
