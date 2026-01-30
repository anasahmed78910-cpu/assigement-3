// ================== PART 1 ==================
const fs = require("fs");
const path = require("path");
const http = require("http");
const zlib = require("zlib");

// ================== PART 2 ==================
let users = [
    { email: "zizoo@gmail", password: "555", id: "1" },
    { email: "yasser", password: "666", id: "2" },
];

const usersFile = path.resolve("./users.json");

// لو الملف مش موجود نعمله
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify(users));
}

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // ========= SIGNUP =========
    if (method === "POST" && url === "/signup") {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            data = JSON.parse(data);
            const { email, password } = data;

            const findUser = users.find((u) => u.email === email);

            if (findUser) {
                res.writeHead(409, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "email exist" }));
            } else {
                const newUser = {
                    email,
                    password,
                    id: Date.now().toString(),
                };

                users.push(newUser);
                fs.writeFileSync(usersFile, JSON.stringify(users));

                res.writeHead(201, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "email added successfully" }));
            }
        });

        // ========= DELETE USER =========
    } else if (method === "DELETE" && url.startsWith("/delete/")) {
        const id = url.split("/")[2];

        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "user not found" }));
        } else {
            users.splice(userIndex, 1);
            fs.writeFileSync(usersFile, JSON.stringify(users));

            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "user deleted" }));
        }

        // ========= GET ALL USERS =========
    } else if (method === "GET" && url === "/getall") {
        const allUsers = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(allUsers));

        // ========= GET BY ID =========
    } else if (method === "GET" && url.startsWith("/getbyid/")) {
        const id = url.split("/")[2];
        const findUser = users.find((u) => u.id === id);

        if (findUser) {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(findUser));
        } else {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "not found" }));
        }

        // ========= UPDATE USER =========
    } else if (method === "PATCH" && url.startsWith("/sign/")) {
        const id = url.split("/")[2];
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            data = JSON.parse(data);
            const { email, password } = data;

            const findUser = users.find((u) => u.id === id);

            if (!findUser) {
                res.writeHead(404, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "user not found" }));
            } else {
                findUser.email = email ?? findUser.email;
                findUser.password = password ?? findUser.password;

                fs.writeFileSync(usersFile, JSON.stringify(users));

                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "user updated" }));
            }
        });

        // ========= NOT FOUND =========
    } else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("404 page not found");
    }
});

server.listen(3000, "localhost", () => {
    console.log("server is running ");
});

server.on("error", (err) => {
    console.log(err);
});
// ===============essay=================
/**
 * 1 the node.js event loop is the mechanism that controls the execution of asynchronous operations and determines when callbacks are executed on the call stack.
 * 2 libuv is a c library used by node.js to handle the event loop, the thread pool, and all asynchronous input/output operations.
 * 3 node.js handles asynchronous operations by delegating heavy tasks to the libuv library, which uses a thread pool to perform the task without blocking the main thread.
 * 4 the call stack execution is single-threaded, meaning that only one operation can be executed at a time.
 *5  the node.js thread pool is a pool of threads that are used to perform asynchronous operations.
 * 6 node js handles non blocking operations by using the event loop to execute callbacks when the operation is complete.
 * 
 * 
 */