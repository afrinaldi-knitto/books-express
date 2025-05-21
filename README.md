
## Kebutuhan

**Node:** 20.18.1 LTS

**Package Manager:** PNPM

## Installation
<p>1. Clone project</p>

```bash
  git clone https://github.com/afrinaldi-knitto/books-express.git
```

<p>2. Masuk folder project</p>

```bash
  cd books-express
```

<p>3. Buka sql dan buat database</p>

```bash
  CREATE DATABASE expressdb
```

<p>4. Tambahkan file .env pada root project</p>

contoh isinya (tinggal sesuaikan valuenya)
```bash
PORT=2201
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=expressdb
DATABASE_URL="mysql://root:@localhost:3306/expressdb"
JWT_SECRET=SECRET
```

<p>5. Install package</p>

```bash
  pnpm install
```
<p>6. Generate prisma</p>

```bash
  npx prisma migrate dev --name init
  npx prisma generate
```
<p>7. Generate API docs</p>

```bash
  npx openapi-generator-cli generate -i openapi.yaml -g html -o ./api-docs
```

## Run

Jalankan project ini dengan

```bash
  pnpm dev
```

untuk melihat dokumentasi swagger buka url
```bash
  http://localhost:2201/api-docs/
```
