# labelit

<a href="https://label-it.herokuapp.com/?github"><img src="docs/try.jpg" width="124" height="53" alt="Try it!"/></a>

An app for labeling images to train your very own image classifier model in the browser.  It uses https://github.com/kevinrobinson/services-edu/ to let you test out on different image searches.

## Demo
https://label-it.herokuapp.com/

#### Labeling
<img src="docs/flow-splash.jpg" alt="flow-splash" width="20%" height="auto" /><img src="docs/flow-new-model.jpg" alt="flow-new-model" width="20%" height="auto" /><img src="docs/flow-swipe.jpg" alt="flow-swipe" width="20%" height="auto" /><img src="docs/flow-swiping.jpg" alt="flow-swiping" width="20%" height="auto" />

#### Training
<img src="docs/flow-train.jpg" alt="flow-train" width="20%" height="auto" /><img src="docs/flow-training.jpg" alt="flow-training" width="20%" height="auto" /><img src="docs/flow-waiting.jpg" alt="flow-waiting" width="20%" height="auto" />

#### Trying it out!
<img src="docs/try-cats-1.jpg" alt="try-cats-1" width="20%" height="auto" /><img src="docs/try-cats-2.jpg" alt="try-cats-2" width="20%" height="auto" /><img src="docs/superdog-0.jpg" alt="superdog-0" width="20%" height="auto" /><img src="docs/superdog-1.jpg" alt="superdog-1" width="20%" height="auto" />

<img src="docs/dog-0.jpg" alt="dog-0" width="20%" height="auto" /><img src="docs/dog-1.jpg" alt="dog-1" width="20%" height="auto" /><img src="docs/ugly-1.jpg" alt="ugly-1" width="20%" height="auto" />


## Development
To develop locally:
```
$ yarn install
$ yarn start
```

This will run the server and the create-react-app development server in parallel, writing the output of both to stdout.

Note that the site is responsive and will include a fake frame for an iPhone 5 running Safari at desktop resolution.

Running `yarn storybook` separately will also start a [storybook](https://github.com/storybooks/storybook) server on port 9001.  You can use this to create "stories" iterate on UI features.

This project was adapted from https://github.com/mit-teaching-systems-lab/groupdate


### To run tests:
```
$ yarn test
```

You can also run the linter and tests independently for the server or client code, see `package.json` for commands.
