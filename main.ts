import snoowrap, { Subreddit, Submission } from "snoowrap";
import { username, password, clientID, clientSecret, webUrl, settings } from "./config.json";
import http from "http";
import https from "https";

const r: snoowrap = new snoowrap({
    userAgent: "MemeEconomy Flair Bot",
    clientId: clientID,
    clientSecret: clientSecret,
    username: username,
    password: password
});

const subreddit: Subreddit = r.getSubreddit("memeinvestor_test");

function Sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

(async () => {
    while (true) {
        const test = await subreddit.getNew({
            limit: settings.limit
        });

        http.get(`${webUrl}/indices/${test[0].id}:subm`, (res) => {
            let body: string = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                let data: indexData = JSON.parse(body);
                test[0].assignFlair({
                    text: `Price: ${data.price.commafy()} Mc`,
                    cssClass: settings.CSSclass
                });
                console.log("Success for post: " + test[0].id);
            });
        }).on("error", (e) => {
            console.error(e.message);
        });

        await Sleep(10000)
    }
})();



declare global {
    interface indexData {
        name: string;
        full_name: string;
        type: string;
        price: number;
        locked: boolean;
    }

    interface Number {
        commafy(): string;
    }

    interface String {
        commafy(): string;
    }
}

Number.prototype.commafy = function () {
    return String(this).commafy();
},

String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
}