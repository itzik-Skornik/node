const http = require("http")
const fs = require("fs");
const url = require("url")
const { json } = require("react-router-dom");
// const isPrime = require('prime-number')

function factorial(num) {
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    return result;
}

const isPrime = (num) => {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
};

const server = http.createServer((req, res) => {
    // let id = q.pathname.split("/")[2]
    const q = url.parse(req.url, true)
    // console.log("id:", id);

    if (q.pathname === '/contacts') {
        console.log(q.pathname);
        fs.readFile("." + q.pathname + ".json", 'utf-8', ((err, data) => {
            console.log(data);
            res.writeHead(200, { 'Content-Teyp': "application/json" })

            res.write(data)
            // console.log(isPrime(19)) 
            res.end()
        }
        ))
    }
    else if (q.pathname.startsWith("/comps/")) {
        const num = q.pathname.split("/")[3];
        const currentComps = q.pathname.split("/")[2];
        console.log("curentComps:", currentComps, "\nnum:", num);

        //factorial
        if (currentComps == "factorial") {
            console.log("curentComps:", currentComps, "\nnum:", num);
            res.writeHead(200, { "Content-type": "text/html" });
            res.write(factorial(num).toString());
            res.end();
        }

        // prime
        if (currentComps == "prime") {
            res.writeHead(200, { "Content-type": "text/html" });
            res.write(isPrime(num).toString()); 
            res.end();
        }
    }
    else if (q.pathname.startsWith("/contacts/")) {
        const id = q.pathname.split("/")[2];
        fs.readFile("./contacts.json", (err, data) => {
            const parseData = JSON.parse(data);
            const find = parseData.find((e) => e.id == id);
            console.log(find);
            if (err) {
                res.writeHead(404, { "content-type": "text/html" });
                res.write("404");
                return res.end();
            }
            if (!find) {
                res.statusCode = 404;
                res.write("no such user");
                return res.end();
            }
            res.writeHead(200, { "content-type": "application/json" });
            res.write(JSON.stringify(find));
            return res.end();
        });
    }
    else {
        fs.readFile("." + req.url + ".html", ((err, data) => {
            if (data) {
                res.writeHead(200, { 'Content-Teyp': "taxt/html" })
                res.write(data)
                res.end()
            }
            else {
                res.writeHead(404, { 'Content-Teyp': "taxt/html" })
                res.write("<h1>The page was not found</h1>")
                res.end()
            }
        }))
    }



}).listen(3001)
