require('dotenv').config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const { unhandledErrorHandler, routeErrorHandler } = require("./middlewares/exception");
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');

class App {
  
  constructor(      
  ) {
      this.app = express();
      this.init();
      // Initialize routes
      this.initRoutes();
      // Initialize error middleware
      this.app.use(unhandledErrorHandler);
  }  

  init() { 
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initRoutes() {   
    //Swagger Docs
    const swaggerSpec = swaggerJsdoc({
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "Elred Assingment",
          version: "1.0.0",
          description:
            "User Authentication & Tasks Management",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        }
      },
      apis: ['./src/routes/*'],  
      swagger: "2.0",
    });
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use('/auth',authRouter);
    this.app.use('/tasks',taskRouter);
    //Route error handler
    this.app.use(routeErrorHandler);
  }

  listen(url, port) {
    const server = this.app.listen(port, url, () => {
        const address = (server.address()).address;
        const port = (server.address()).port;
        console.log(`Application running on url: http://${address}:${port}/`);          
    });
    return server;
  }

}

module.exports = App;