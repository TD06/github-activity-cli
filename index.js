#!/usr/bin/env node

const https = require('https');

// Get username from CLI
function getUsername() {
    const username = process.argv[2];

    if (!username) {
        console.log("Please provide a username");
        process.exit(1);
    }

    return username;
}

// Fetch GitHub activity
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

            const seenTypes = new Set();
            let count = 0;

            for (let event of events) {
                if (count >= 5) break;

                // Push
                if (event.type === "PushEvent" && !seenTypes.has("PushEvent")) {
                    console.log(`- Pushed commits to ${event.repo.name}`);
                    seenTypes.add("PushEvent");
                    count++;
                }

                // Star
                else if (event.type === "WatchEvent" && !seenTypes.has("WatchEvent")) {
                    console.log(`- Starred ${event.repo.name}`);
                    seenTypes.add("WatchEvent");
                    count++;
                }

                // Issue
                else if (
                    event.type === "IssuesEvent" &&
                    event.payload.action === "opened" &&
                    !seenTypes.has("IssuesEvent")
                ) {
                    console.log(`- Opened a new issue in ${event.repo.name}`);
                    seenTypes.add("IssuesEvent");
                    count++;
                }

                // Pull Request
                else if (
                    event.type === "PullRequestEvent" &&
                    event.payload.action === "opened" &&
                    !seenTypes.has("PullRequestEvent")
                ) {
                    console.log(`- Opened a pull request in ${event.repo.name}`);
                    seenTypes.add("PullRequestEvent");
                    count++;
                }

                // Fork
                else if (event.type === "ForkEvent" && !seenTypes.has("ForkEvent")) {
                    console.log(`- Forked ${event.repo.name}`);
                    seenTypes.add("ForkEvent");
                    count++;
                }
            }
        });

    }).on("error", (err) => {
        console.log("Request failed:", err.message);
    });
}

// Main
function main() {
    const username = getUsername();
    console.log(`Fetching activity for ${username}...`);
    fetchGitHubActivity(username);
}

main();