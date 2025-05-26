import { Router } from "express";
import booksRouter from "./book.router";
import authorRouter from "./authors.route";

const v1Router = Router();

v1Router.use(booksRouter);
v1Router.use(authorRouter);

export default v1Router;
