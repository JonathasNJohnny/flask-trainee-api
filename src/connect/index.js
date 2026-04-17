import { MongoClient, ServerApiVersion } from "mongodb";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "trainee";
const DNS_SERVERS = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (DNS_SERVERS.length) {
  dns.setServers(DNS_SERVERS);
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI nao foi definido no .env");
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

const connectClient = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  return client;
};

const getDb = async () => {
  const connectedClient = await connectClient();
  return connectedClient.db(MONGODB_DB_NAME);
};

const pingDatabase = async () => {
  const connectedClient = await connectClient();
  await connectedClient.db("admin").command({ ping: 1 });
};

export const connect = {
  getDb,
  pingDatabase,
};
