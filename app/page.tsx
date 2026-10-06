export default function Home() {
  return (
    <main style={{ padding: "4rem 1rem", maxWidth: 640, margin: "0 auto" }}>
      <h1>Next.js × Vercel Template</h1>
      <p>
        Deploys only from <code>main</code> (production) and <code>develop</code> (preview).
        Feature branches never trigger a Vercel build.
      </p>
      <p>
        Environment: <code>{process.env.NEXT_PUBLIC_VERCEL_ENV ?? "local"}</code>
      </p>
    </main>
  );
}
