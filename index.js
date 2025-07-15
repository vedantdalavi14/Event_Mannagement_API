const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.log('Please create a .env file based on .env.example and provide the necessary values.');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API is running!');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // WARNING: { force: true } will drop and recreate all tables.
    // This is useful for development but should not be used in production.
    // Use migrations for production environments.
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Exit the process if we can't connect to the database
    process.exit(1);
  }
};

startServer();