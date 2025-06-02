import { prisma } from "../prisma";

export const getAllAuthors = async () => {
  const authors = await prisma.authors.findMany({
    select: { id: true, name: true, books: true, slug: true },
  });
  return authors.map((author) => ({
    id: author.id,
    name: author.name,
    slug: author.slug,
    books: author.books?.map((book) => book.title) ?? null,
  }));
};

export const getAuthor = async (id: number) => {
  const author = await prisma.authors.findUniqueOrThrow({
    where: { id },
    select: { id: true, name: true, books: true, slug: true },
  });
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    books: author.books?.map((book) => book.title) ?? null,
  };
};

export const getAuthorBySlug = async (slug: string) => {
  const author = await prisma.authors.findUnique({
    where: { slug: slug },
    select: { id: true, name: true, books: true, slug: true },
  });
  if (!author) return null;
  return {
    id: author?.id,
    name: author?.name,
    slug: author?.slug,
    books: author?.books?.map((book) => book.title) ?? null,
  };
};

export const getBookBySlugExceptId = (slug: string, id: number) => {
  return prisma.authors.findFirst({ where: { slug: slug, NOT: { id } } });
};

export const createAuthor = async (name: string, slug: string) => {
  const author = await prisma.authors.create({
    data: { name: name, slug: slug },
    select: { id: true, name: true, books: true, slug: true },
  });
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    books: author.books?.map((book) => book.title) ?? null,
  };
};

export const updateAuthor = async (id: number, name: string, slug: string) => {
  return await prisma.authors.update({
    where: { id },
    data: {
      ...(name && { name: name }),
      ...(slug && { slug: slug }),
    },
  });
};

export const deleteAuthor = async (id: number) => {
  return await prisma.authors.delete({
    where: { id },
  });
};
