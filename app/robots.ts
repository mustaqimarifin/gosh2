export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: 'http://localhost:3000/sitemap.xml',
    host: 'http://localhost:3000',
  }
}
