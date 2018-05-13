# Fuinki


**fuinki** [雰囲気] - ambience, atmosphere, mood, vibe

Fuinki is a gig exploration and vibe analyses tool.



## Development

### Using Gulp

Requirements:

- [Node with NPM](https://nodejs.org/en/)
- [Gulp](https://gulpjs.com/) and [BrowserSync](https://browsersync.io/) installed globally

From root directory of the project run ``npm install`` or ``yarn install`` if you are using [Yarn](https://yarnpkg.com/en/).

After you simply run ``gulp``.

This will open a new browser window that will reload each time you save a change to project files.

### Working with JavaScript

The project relies on manually downloading and managing JS libraries and custom scripts.

To add a new library list a path to the library in `js_lib_src` array in `gulpfile.js`.

JS files in `assets_src/js/components/` are automatically concatenated in **alphabetical order** (you can use number prefix to control the order). Files in here should be entirely self-contained or only be comprised of functions that later get called from `app.js`.




Please note that the order matters, so make sure you list any dependencies before files that require them.



## Contributors

- Jony Cohen
- Alfie Long
- Ilja Panic [[web](https://iljapanic.com)] [[twitter](https://twitter.com/iljapanic)]
- Soma Suzuki