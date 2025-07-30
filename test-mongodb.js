const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017/my-project';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    
    // Get the database
    const database = client.db('my-project');
    
    // List collections
    const collections = await database.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Test inserting a document
    const usersCollection = database.collection('users');
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(testUser);
    console.log('Inserted document with _id:', result.insertedId);
    
    // Query the document
    const foundUser = await usersCollection.findOne({ email: 'test@example.com' });
    console.log('Found user:', foundUser);
    
    // Clean up
    await usersCollection.deleteOne({ email: 'test@example.com' });
    console.log('Test document deleted');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);