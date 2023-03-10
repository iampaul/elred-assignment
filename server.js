require('dotenv').config();
const mongoose = require('mongoose');
const App = require("./src/app");

class Server {  
  static async start() {
      const app = new App();
      // Connect to the database
      mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to the database'))
      .catch(err => console.error('Database connection error:', err));
            
      return app.listen(
          process.env.DOMAIN,          
          parseInt(process.env.PORT,10)		  
      );
  }
}

Server.start().then(async(server) => {
  console.log('Application started running');
}).catch((error) => {
  console.error('Failed to start application', error);
})
