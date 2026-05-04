# GitHub Activity CLI

A simple command-line tool to fetch and display recent activity of a GitHub user using the GitHub API.

---

## Features

* Fetches recent GitHub activity of any user
* Displays activity in a readable format
* Handles invalid usernames and API errors
* Uses only built-in Node.js modules (no external libraries)

---

## Usage

Run the command:

```bash
github-activity <username>
```

Example:

```bash
github-activity torvalds
```

---

## Sample Output

```text
Fetching activity for torvalds...

Recent Activity:

- Pushed commits to torvalds/linux
- Starred some-repo
- Opened a new issue in another-repo
```

---

## How It Works

* Accepts a GitHub username as a command-line argument
* Sends a request to the GitHub Events API
* Parses the JSON response
* Formats and prints activity in the terminal

---

## Tech Stack

* Node.js
* Built-in https module
* GitHub REST API

---

## Error Handling

* Displays a message if no username is provided
* Handles invalid users (404 response)
* Handles request failures

---

## Future Improvements

* Filter activity by event type
* Improve output formatting
* Add caching for API responses

https://roadmap.sh/projects/github-user-activity
