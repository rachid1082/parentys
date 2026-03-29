export async function GET(request) {
  // Preserve the hash fragment by returning a raw HTML redirect
  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url='${request.url}'" />
        </head>
        <body></body>
      </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  )
}
