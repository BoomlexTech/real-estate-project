import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';

const dev: boolean = process.env.NODE_ENV !== 'production';
const hostname: string = 'localhost';
const port: number = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // The 'true' argument ensures the query string is parsed into an object
      const parsedUrl = parse(req.url!, true);
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
