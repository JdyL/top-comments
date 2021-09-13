# Top Comments
<p align="center">
 <img src="https://github.com/JdyL/codegeist-2021/blob/master/logo.svg" width="200" height="200" alt="picture of crown with purple background">
</p>
Top Comments is a plugin for Confluence which pins the most liked comment within the page.

This project is built using Forge and written in Javascript as a Confluence Macro.

This was for Codegeist 2021 hackathon.

## What can it do

![demo gif](https://github.com/JdyL/codegeist-2021/blob/master/demo.gif)

After adding it to the confluence page and setting any custom configurations (e.g. default messages, minimum likes, etc), the comment with the highest amount of likes (and more than the minimum likes - default is 1) will be pinned on the original post.

![confluence page with top comments plugin](https://github.com/JdyL/codegeist-2021/blob/master/screenshot.png)

## Forge setup

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

### Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

### Quick start

- Modify your app by editing the `src/index.jsx` file.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

#### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

### Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
