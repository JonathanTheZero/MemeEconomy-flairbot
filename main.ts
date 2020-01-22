import snoowrap, { Subreddit, Submission, RedditUser } from "snoowrap";
import { username, password, clientID, clientSecret, webUrl, settings } from "./config.json";
import http from "http";
import https from "https";
import { indexData, userData, apiErr } from "./main.d";

const r: snoowrap = new snoowrap({
    userAgent: "MemeEconomy Flair Bot",
    clientId: clientID,
    clientSecret: clientSecret,
    username: username,
    password: password
});

const sub = "memeinvestor_test";
const subreddit: Subreddit = r.getSubreddit(sub);

//main loop
(async () => {
    while (true) {
        await flairUser("Wunder_Kindd");
        //await flairPosts();
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
                let data: indexData | apiErr = JSON.parse(body);
                if(instanceOfErr(data)){
                    throw new Error("Couldn't reach API\nResponse was " + data.err);
                }
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

    http.get(`${webUrl}/investors/${user.name}`, (res) => {
        let body: string = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end", () => {
            let data: userData | apiErr = JSON.parse(body);
            if(instanceOfErr(data)){
                throw new Error("Couldn't reach API\nResponse was " + data.err);
            }
            (user as RedditUser).assignFlair({
                subreddit: sub,
                text: `${data.index.price.commafy()} M¢${(data.firm && data.firm.name) ? `| ${data.firm.name + " " + data.firm.index.price.commafy()}M¢` : ""}`,
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

function instanceOfErr(object: any): object is apiErr {
    return 'err' in object;
}