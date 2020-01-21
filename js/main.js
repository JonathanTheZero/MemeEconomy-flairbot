"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const subreddit = r.getSubreddit("memeinvestor_test");
function Sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        const test = yield subreddit.getNew({
            limit: config_json_1.settings.limit
        });
        http_1.default.get(`${config_json_1.webUrl}/indices/${test[0].id}:subm`, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                let data = JSON.parse(body);
                test[0].assignFlair({
                    text: `Price: ${data.price.commafy()} Mc`,
                    cssClass: config_json_1.settings.CSSclass
                });
                console.log("Success for post: " + test[0].id);
            });
        }).on("error", (e) => {
            console.error(e.message);
        });
        yield Sleep(10000);
    }
}))();
Number.prototype.commafy = function () {
    return String(this).commafy();
},
    String.prototype.commafy = function () {
        return this.replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
        });
    };
