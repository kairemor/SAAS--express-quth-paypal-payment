import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import openApiDocumentation from '../openApiDocumentation.json';
import apiRouter from "./routes";
import errorHandler from "./lib/globalErrorHandler";
import GlobalError from "./lib/globalError";

const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

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

app.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
});
