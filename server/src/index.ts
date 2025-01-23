import express, { Application, Response, Request } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import { createServer, Server as HttpServer } from "http";
import * as path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { verifyEmail } from './routes/auth/verifyEmail.js';
import { redisConnection } from './config/queue.js';
import authRoutes from './routing/authRoutes.js';

// Get current directory for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment variables
const PORT = process.env.PORT || 7000;

// Create Express app and HTTP server
const app: Application = express();
const server: HttpServer = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// Export io for use in other modules
export { io };

// Socket setup
import { setupSocket } from "./socket.js";
setupSocket(io);

// Middleware
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// Import job queue
import "./jobs/index.js";

// Import helper functions
import { checkDateHourDifference } from "./helper.js";

// Add after other middleware setup
(redisConnection as any).on('error', (error: any) => {
  console.error('Redis connection error:', error);
});



// Sample route
app.get("/", async (req: Request, res: Response) => {
  const hoursDiff = checkDateHourDifference("2024-07-15T07:36:28.019Z");
  return res.json({ message: hoursDiff });
});

// Routes
import routes from "./routing/index.js";
app.use("/", routes);

app.get('/api/verify-email', verifyEmail);

// Mount routes
app.use('/', authRoutes);  // This will handle all auth routes

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});