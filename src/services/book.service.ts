import { BookPayload } from "../models/book";
import { prisma } from "../prisma";

export const findAllBooks = () => {
  return prisma.books.findMany({
    include: { authors: true },
  });
};

export const findBookById = (id: number) => {
  return prisma.books.findUnique({
    where: {
      id: id,
    },
  });
};

export const findBookBySlug = (slug: string) => {
  return prisma.books.findUnique({
    where: {
      slug: slug,
    },
  });
};

export const findBookBySlugExceptId = (slug: string, id: number) => {
  return prisma.books.findFirst({ where: { slug: slug, NOT: { id } } });
};

export const createBook = (payload: BookPayload) => {
  const { title, author_id, slug } = payload;
  return prisma.books.create({
    data: {
      title: title,
      slug: slug,
      author_id: author_id,
    },
  });
};

export const updateBook = (payload: {
  id: number;
  title?: string;
  author_id?: number | null;
  slug?: string;
}) => {
  const { id, title, author_id, slug } = payload;
  return prisma.books.update({
    select: { title: true, authors: true },
    data: {
      ...(title && { title: title }),
      ...(typeof author_id !== "undefined" && { author_id: author_id }),
      ...(slug && { slug: slug }),
    },
    where: {
      id: id,
    },
  });
};

export const deleteBook = (id: number) => {
  return prisma.books.delete({
    where: {
      id: id,
    },
  });
};
