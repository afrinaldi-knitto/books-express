import { NextFunction, Request, Response } from "express";
import * as BookService from "../services/book.service";
import { BookPayload } from "../models/book";
import { slugify } from "../utils/common-helper";

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await BookService.findAllBooks();
    res.json({ message: "Success show books", data: books });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await BookService.findBookById(Number(req.params.id));
    res.json({ message: "Success", data: book });
  } catch (error) {
    next(error);
  }
};

export const getBookBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await BookService.findBookBySlug(req.params.slug);
    res.json({ message: "Success", data: book });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request<{}, {}, BookPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author_id } = req.body;
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;

    while (await BookService.findBookBySlug(slug)) {
      slug = `${baseSlug}-${count++}`;
    }

    const book = await BookService.createBook({
      title: title,
      author_id: author_id,
      slug: slug,
    });
    res.json({ message: "Book inserted", data: book });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request<
    { id: string },
    {},
    { title?: string; author_id?: number | null }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author_id } = req.body;
    let dataToUpdate: any = {};
    if (title) {
      let baseSlug = slugify(title);
      let slug = baseSlug;
      let count = 1;

      while (
        await BookService.findBookBySlugExceptId(slug, Number(req.params.id))
      ) {
        slug = `${baseSlug}-${count++}`;
      }
      dataToUpdate.slug = slug;
      dataToUpdate.title = title;
    }
    if (typeof author_id !== "undefined") {
      dataToUpdate.author_id = author_id;
    }

    const book = await BookService.updateBook({
      id: Number(req.params.id),
      ...dataToUpdate,
    });
    res.json({ message: "Book updated", data: book });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await BookService.deleteBook(Number(req.params.id));
    res.json({ message: "Book deleted", data: book });
  } catch (error) {
    next(error);
  }
};
