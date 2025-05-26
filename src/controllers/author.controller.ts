import { Request, Response, NextFunction } from "express";
import * as AuthorService from "../services/author.service";

export const getAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authors = await AuthorService.getAllAuthors();
    res.json({ message: "Success", data: authors });
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await AuthorService.getAuthor(Number(req.params.id));
    res.json({ message: "Success", data: author });
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const newAuthor = await AuthorService.createAuthor(name);
    res.status(201).json({ message: "Author created", data: newAuthor });
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (
  req: Request<{ id: string }, {}, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await AuthorService.updateAuthor(
      Number(req.params.id),
      req.body.name
    );
    res.json({ message: "Author was updated", data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthorService.deleteAuthor(Number(req.params.id));
    res.json({ message: "Author was deleted", data: {} });
  } catch (error) {
    next(error);
  }
};
