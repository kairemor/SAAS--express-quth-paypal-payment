import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import passport from 'passport';
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import openApiDocumentation from '../openApiDocumentation.json';
import apiRouter from "./routes";
import errorHandler from "./lib/globalErrorHandler";
import GlobalError from "./lib/globalError";
import models from './models'
dotenv.config();

const app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.use(apiRouter);

app.all("*", async (req, res, next) => {
  const err = new GlobalError(
    `${req.originalUrl} does not exist on the server`,
    404
  );

  next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`server listen at port ${PORT}`);
  });
})

