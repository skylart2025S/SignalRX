# SignalRx

A healthcare peer-experience workspace built with Next.js. Ask a health-related practice question, explore synthetic peer perspectives, and inspect the source responses behind a network summary.

This prototype uses synthetic HCP and response data and is not intended for production clinical use.

## Local development

```sh
npm ci
npm run dev
```

Optionally configure `OPENAI_API_KEY` in `.env.local` for model-generated peer experiences and summaries. Without a key, the app uses topic-based synthetic examples. Never expose this key through a `NEXT_PUBLIC_` variable.

## Validation

```sh
npm run build
npx tsx --test tests/peer-relevance.test.ts
```

## Vercel hosting

```sh
npx vercel login
npx vercel --prod
```

Select the Next.js framework and the project root. The API's synthetic profile dataset is included in its server bundle. Local environment files and logs are excluded from upload.

To enable model-generated responses, add `OPENAI_API_KEY` as a server-side Production environment variable in Vercel, then redeploy. The deployed app also works without it using the synthetic fallback.
