#!/usr/bin/env node

const https = require('https');


function getUsername() {
    const username = process.argv[2];

    if (!username) {
        console.log("Please provide a username");
        process.exit(1);
    }

    return username;
}


function fetchGitHubActivity(username) {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/events`,
        headers: {
            'User-Agent': 'node'
        }
    };

    https.get(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {

            if (res.statusCode === 404) {
                console.log("User not found");
                return;
            }

            if (res.statusCode !== 200) {
                console.log("Error fetching data. Status Code:", res.statusCode);
                return;
            }

            const events = JSON.parse(data);

            if (events.length === 0) {
                console.log("No recent activity found");
                return;
            }

            console.log("\nRecent Activity:\n");

            const seen = new Set();
            let count = 0;

            for (let event of events) {
                if (count >= 5) break;

                if (event.type === "PushEvent") {
                    if (seen.has(event.repo.name)) continue;

                    seen.add(event.repo.name);
                    console.log(`- Pushed commits to ${event.repo.name}`);
                    count++;
                } 
                
                else if (event.type === "WatchEvent") {
                    if (seen.has(event.repo.name)) continue;

                    seen.add(event.repo.name);
                    console.log(`- Starred ${event.repo.name}`);
                    count++;
                } 
                
                else if (event.type === "IssuesEvent") {
                    if (event.payload.action === "opened") {
                        if (seen.has(event.repo.name)) continue;

                        seen.add(event.repo.name);
                        console.log(`- Opened a new issue in ${event.repo.name}`);
                        count++;
                    }
                }
            }
        });

    }).on("error", (err) => {
        console.log("Request failed:", err.message);
    });
}


function main() {
    const username = getUsername();
    console.log(`Fetching activity for ${username}...`);
    fetchGitHubActivity(username);
}

main();