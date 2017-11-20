This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). The latest guide to "Create React App" is located [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The application is already live on Github Pages. You may view the web application [here](https://tra38.github.io/LaunchPedia).

## To Start

```
npm install
npm start
```

## Scripts

- ```npm run start``` - Run app in development mode.
- ```npm run tests``` - Run all automated tests.
- ```npm run build``` - Build the app for production. The generated output is placed in the ```/docs``` folder so that GitHub Pages can read from it. Read this [guide by Superpencil](https://github.com/facebookincubator/create-react-app/issues/1354#issuecomment-316890832) to learn how we were able to configure our application to work with Github Pages
-```npm run eject``` - Eject from "Create React App"

# Folders in ```src```

- ```App``` contains App, the main compontent that contains most of the business logic we use to query all rocket launches and display the results. It is a stateful compontent.
  - To handle state changes, the App passes certain callback functions and the FavoritesStore to the other compontents. Those compontents can trigger the callback functions when certain events occur, causing App to update its state.
- ```css``` contains all ouf custom css that we use to style the webapp.
- ```defaults``` contains the constants that we use for the application. Right now, we only have two - the default Start Date and the default End Date.
- ```dependencies``` store references to the two external dependencies were rely on heavily: ```react-bootstrap``` and ```react-date```. We refer to this folder when some of our compontents require compontents from these two dependencies.
- ````launches``` contain all compontents used for displaying Launches. All compontents in ```launches``` are stateless, and are dependent on props passed in from external compontents.
- ```search``` contains all all compontents used for searching. There are two stateful compontents (```SearchInput``` and ```LaunchDatePicker```) and a stateless compontent (```SearchPanel```) that is used to render the two stateful compontents.
- ```stores``` contains all compontents used for storing data. Right now, we only have one store (```FavoritesStore```), and we are using "mobx" to handle our state.
- ```utils``` contains misc. files. For now, we only have a Loading Screen that is displayed when users are searching for dates.

To avoid long and confusing import statements, we have an ```all.js``` file in the following folders: ```defaults```, ```launches```, ```search```, and ```store```. If a developer want to use a compontent from those folders, they will import the compontent from ```all.js```.

Here is an example code snippet from ```app.js```:

```
import { LaunchDisplay } from '../launches/all'
```

# Possible Improvements

- Add automated tests.
- Persist the FavoritesStore across user sessions.
- Refactor the business logic that still remains in App.js to make it easier to understand.
