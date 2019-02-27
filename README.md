# labelit

<a href="https://label-it.herokuapp.com/?github"><img src="docs/try.jpg" width="124" height="53" alt="Try it!"/></a>

An app for labeling images to train your very own image classifier model in the browser.  It uses https://github.com/kevinrobinson/services-edu/ to let you test out on different image searches.

## Demo
https://label-it.herokuapp.com/

#### Labeling
| ![flow-splash](docs/flow-splash.jpg) | ![flow-new-model](docs/flow-new-model.jpg) | ![flow-swipe](docs/flow-swipe.jpg) | ![flow-swiping](docs/flow-swiping.jpg) |

#### Training
| ![flow-train](docs/flow-train.jpg) | ![flow-training](docs/flow-training.jpg) | ![flow-waiting](docs/flow-waiting.jpg) | |

#### Trying it out!
| ![try-cats-1](docs/try-cats-1.jpg) | ![try-cats-2](docs/try-cats-2.jpg) | ![superdog-0](docs/superdog-0.jpg) | ![superdog-1](docs/superdog-1.jpg) |
| ![dog-0](docs/dog-0.jpg) | ![dog-1](docs/dog-1.jpg) | ![ugly-1](docs/ugly-1.jpg) | |


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
