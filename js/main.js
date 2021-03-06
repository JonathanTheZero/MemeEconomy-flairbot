"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap_1 = __importDefault(require("snoowrap"));
const config_json_1 = require("./config.json");
const http_1 = __importDefault(require("http"));
const r = new snoowrap_1.default({
    userAgent: "MemeEconomy Flair Bot",
    clientId: config_json_1.clientID,
    clientSecret: config_json_1.clientSecret,
    username: config_json_1.username,
    password: config_json_1.password
});
const sub = "memeinvestor_test";
const subreddit = r.getSubreddit(sub);
(async () => {
    while (true) {
        await flairUser("Wunder_Kindd");
        await Sleep(10000);
    }
})();
async function flairPosts(limit = config_json_1.settings.limit) {
    const submissions = await subreddit.getNew({
        limit: limit
    });
    for (let post of submissions) {
        http_1.default.get(`${config_json_1.webUrl}/indices/${post.id}:subm`, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                let data = JSON.parse(body);
                if (instanceOfErr(data)) {
                    throw new Error("Err: Couldn't reach API");
                }
                post.assignFlair({
                    text: `Price: ${data.price.commafy()} M¢`,
                    cssClass: config_json_1.settings.CSSclass
                });
                console.log("Success for post: " + post.id);
            });
        }).on("error", (e) => {
            console.error(e.message);
        });
    }
}
async function flairUser(user) {
    if (typeof user === "string") {
        user = r.getUser(user);
    }
    http_1.default.get(`${config_json_1.webUrl}/investors/${user.name}`, (res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            let data = JSON.parse(body);
            if (instanceOfErr(data)) {
                throw new Error("Err: Couldn't reach API");
            }
            user.assignFlair({
                subreddit: sub,
                text: `${data.index.price.commafy()} M¢${(data.firm && data.firm.name) ? `| ${data.firm.name + " " + data.firm.index.price.commafy()}M¢` : ""}`,
                cssClass: config_json_1.settings.CSSclass
            });
            console.log("Success for user: " + user.name);
        });
    }).on("error", (e) => {
        console.error(e.message);
    });
}
function Sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
Number.prototype.commafy = function () {
    return String(this).commafy();
};
String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};
function instanceOfErr(object) {
    return 'err' in object;
}
