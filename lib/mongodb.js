import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error('Добавьте переменную окружения MONGO_URI в .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // В режиме разработки используем глобальную переменную для сохранения соединения
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // В продакшене создаем новое соединение
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;