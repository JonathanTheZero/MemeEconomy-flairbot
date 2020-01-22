import snoowrap, { Subreddit, Submission, RedditUser } from "snoowrap";
import { username, password, clientID, clientSecret, webUrl, settings } from "./config.json";
import http from "http";
import https from "https";
import { indexData, userData } from "./main.d";

const r: snoowrap = new snoowrap({
    userAgent: "MemeEconomy Flair Bot",
    clientId: clientID,
    clientSecret: clientSecret,
    username: username,
    password: password
});

const subreddit: Subreddit = r.getSubreddit("memeinvestor_test");

//main loop
(async () => {
    while (true) {
        await flairUser("JonathanTheZero");
        await flairPosts();
        await Sleep(10000);
    }
})();

async function flairPosts(limit=settings.limit): Promise<void> {
    const submissions = await subreddit.getNew({
        limit: limit
    });

    for(let post of submissions){
        http.get(`${webUrl}/indices/${post.id}:subm`, (res) => {
            let body: string = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                let data: indexData = JSON.parse(body);
                post.assignFlair({
                    text: `Price: ${data.price.commafy()} M¢`,
                    cssClass: settings.CSSclass
                });
                console.log("Success for post: " + post.id);
            });
        }).on("error", (e) => {
            console.error(e.message);
        });
    }
}

async function flairUser(user: RedditUser | string): Promise<void>{
    if(typeof user === "string"){
        user = r.getUser(user);
    }

    http.get(`${webUrl}/indices/${user.name}:user`, (res) => {
        let body: string = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            let data: userData = JSON.parse(body);
            (user as RedditUser).assignFlair({
                text: `${data.index.price.commafy()} M¢`,
                cssClass: settings.CSSclass
            });
            console.log("Success for user: " + (user as RedditUser).name);
        });
    }).on("error", (e) => {
        console.error(e.message);
    });
}

function Sleep(ms: number) {
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