# nb-web

A (currently extremely crude and ugly) web based version of
[nb](https://xwmx.github.io/nb/).

- Currently read-only

## Instructions

- To get started, load the app.
- It will ask for a URL via a pop up
  - Enter a valid git URL
  - You probably need to include authentication
  - For example `https://user:pass@host/user/repo.git`
  - The repo must return proper CORS headers
    - Unfortunately this excludes GitHub, GitLab, and some others
    - Gitea can have CORS headers enabled and works great
- Click the clone button, wait for the success alert
- Click the "Load notebook" button to see the notebook
- Click on a note to load it or a folder to navigate to it

Please feel free to file an issue if you hit any problems.
