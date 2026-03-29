export async function GET(request) {
  // Return the HTML page as-is so the hash is preserved
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
