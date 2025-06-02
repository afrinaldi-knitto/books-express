import { Request, Response, NextFunction } from "express";
import * as AuthorService from "../services/author.service";
import { slugify } from "../utils/common-helper";

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

export const getAuthorBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await AuthorService.getAuthorBySlug(req.params.slug);
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
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await AuthorService.getAuthorBySlug(slug)) {
      slug = `${baseSlug}-${count++}`;
    }
    const newAuthor = await AuthorService.createAuthor(name, slug);
    res.status(201).json({ message: "Author created", data: newAuthor });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateAuthor = async (
  req: Request<{ id: string }, {}, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body.name;
    let dataToUpdate: any = {};
    if (name) {
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let count = 1;

      while (
        await AuthorService.getBookBySlugExceptId(slug, Number(req.params.id))
      ) {
        slug = `${baseSlug}-${count++}`;
      }
      dataToUpdate.slug = slug;
      dataToUpdate.name = name;
    }

    const updated = await AuthorService.updateAuthor(
      Number(req.params.id),
      dataToUpdate.name,
      dataToUpdate.slug
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
