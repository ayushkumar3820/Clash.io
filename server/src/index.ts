// import express, { Application, Response, Request } from "express";
// import "dotenv/config";
// import cors from "cors";
// import helmet from "helmet";
// import ExpressFileUpoad from "express-fileupload";
// import { createServer, Server as HttpServer } from "http";
// const PORT = process.env.PORT || 7000 ;
// import * as path from "path";
// import { fileURLToPath } from "url";
// import { Server } from "socket.io";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const app: Application = express();
// const server: HttpServer = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//   },
// });

// // export { io };

// // setupSocket(io);

// // *middleware
// app.use(cors());
// app.use(helmet());
// app.use(
//   ExpressFileUpoad({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// // * Set View engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve(__dirname, "./views"));

// // * Set Queue
// import "./jobs/index.js";

// app.get("/", async (req: Request, res: Response) => {
//   // const hoursDiff = checkDateHourDifference("2024-07-15T07:36:28.019Z");
//   // const html =  await  ejs.renderFile(__dirname + `/views/emails/welcome.ejs`,{
//   //   name:"Ayush Kumar"
//   // })
//   // await  sendMail("pajipa2002@datingel.com","testing SMTP",html)
//   await emailQueue.add(emailQueueName,{name:"Ayush",age:24})
//   return res.json({ message: "Email  send successFully" });
// });

// // *Routes
// import routes from "./routing/index.js";
// import { checkDateHourDifference } from "./helper.js";
// import { setupSocket } from "./socket.js";
// import { sendMail } from "./config/mail.js";
// import ejs, { name } from "ejs";
// import { emailQueue, emailQueueName } from "./jobs/EmailQueue.js";
// app.use("/", routes);

// server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));




import express, { Application, Response, Request } from "express";
const app: Application = express();
const PORT = process.env.PORT || 7000 ;
import "dotenv/config";
import cors from "cors";
import path from "path";
import router from "./routing/index.js";
import { emailQueue, emailQueueName } from "./jobs/EmailQueue.js";
import ejs from "ejs";
import { sendMail } from "./config/mail.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));


// * Set View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/", router);

app.get("/", async (req: Request, res: Response) => {
  
 
  const html =  await  ejs.renderFile(__dirname + `/views/emails/welcome.ejs`,{
    name:"Ayush Kumar"
  })
  await  sendMail("pajipa2002@datingel.com","testing SMTP",html)
  // await emailQueue.add(emailQueueName,{name:"Ayush",age:24})
  return res.json({ message: "Email  send successFully" });
});

app.listen(PORT,() => console.log(`Server is running on PORT ${PORT}`));



