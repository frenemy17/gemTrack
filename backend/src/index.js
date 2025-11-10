require('dotenv').config({ path: '../.env' });
const express=require("express")
const authRoutes = require('./routes/auth'); 
const itemRoutes=require('./routes/items')
const app=express()
const prisma=require('./prismaClient');
const cors = require('cors');

const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(cors({
  origin : "*",
  methods : ["GET","POST","PUT","DELETE"],
}));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes)

async function connectToDatabase() {
try{
  prisma.$connect();
  console.log('Connected to the database');
} catch (error) {
  console.error('Failed to connect to database:', error);
  process.exit(1);

}
}

app.get('/', (req, res) => {
  res.send('Jewelry Manager API is running!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase();
});