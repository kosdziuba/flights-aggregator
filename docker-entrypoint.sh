#!/bin/bash
rm -rf dist
npx prisma generate
npx prisma db push
npm run build
npm run start:prod