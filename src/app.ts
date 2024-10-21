import express, { Application } from 'express';
import cors from 'cors';

import { config, sequelize } from './config';

import RequestLogging from './middlewares/RequestLogging';
import StatusCheck from './routes/StatusCheck';
import ErrorHandler from './middlewares/ErrorHandler';
import syncModels from './models/Association';
import UserRouter from './routes/UserRouter';
import VideoRouter from './routes/VideoRouter';
import RelUserVideoRouter from './routes/RelUserVideoRouter';
import CommentRouter from './routes/CommentRouter';
// import dummyRouter from './routes/DummyRouter';

class App {
  private app: Application;
  private PORT: string | number;


  constructor() {
    this.app = express();
    this.PORT = config.port || 3000;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware = () => {
    this.app.use([
      cors(),
      express.json(),
      express.urlencoded({ extended: true }),
      RequestLogging
    ]);
  };

  private initializeRoutes = () => {
    this.app.use("/test", StatusCheck);
    this.app.use("/user", UserRouter);
    this.app.use("/video", VideoRouter);
    this.app.use("/rel-user-video", RelUserVideoRouter);
    this.app.use("/comments", CommentRouter);
    // this.app.use("/dummy", dummyRouter);
  };

  private initializeErrorHandling = () => {
    this.app.use(ErrorHandler);
  };

  public run = async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection is established");
      await syncModels();
      this.app.listen(this.PORT,
        () => {
          console.log(`Server is running at http://127.0.0.1:${this.PORT}`);
        }
      );
    } catch (error) {
      console.error(`Unable to connect to database: ${error}`);
      process.exit(1);
    }
  };
};

export default App;