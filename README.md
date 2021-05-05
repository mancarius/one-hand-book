# React Project

![GitHub repo size](https://img.shields.io/github/repo-size/mancarius/react-project?style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mancarius/react-project?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/mancarius/react-project?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/mancarius/react-project?style=plastic)

<br/>

![project screen shot](https://github.com/mancarius/react-project/blob/main/images/screenshot.png)

<br/>

React app that allows you to search in a large books collection and view the details of each volume. By logging in with your Google account, you can also view and manage your shelves.
This is a practice project.
([View online](https://www.mattiamancarella.com/works/react/react-project/))

<br/>

### Built With

* [notistack](https://https://iamhosseindhv.com/notistack)
* [lodash](https://lodash.com)
* [react-infinite-scroll-hook](https://github.com/onderonur/react-infinite-scroll-hook)
* [react-redux](https://react-redux.js.org)
* [react-router-dop](https://reactrouter.com/web/guides/quick-start)
* [react-slick](https://react-slick.neostack.com)
* [material-ui](https://material-ui.com/)

<br/>

## Installation

Just fork and install packages with <code>npm</code> running the following command in the content folder:

```bash
npm install
```

<br/>

## Usage

In order to access the api services, you need to get your own api keys respectivelly from [Google Books](https://developers.google.com/books), [firebase](https://firebase.google.com/) and [ipstack](https://ipstack.com/).
Then save your keys in your <code>.env</code> file in the root directory like this
```.env
REACT_APP_FIREBASE_KEY=your-firebase-api-key
REACT_APP_FIREBASE_DOMAIN=your-firebase-api-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-api-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-api-storage-bucket
REACT_APP_FIREBASE_SENDER_ID=your-firebase-api-sender
REACT_APP_FIREBASE_ID=your-firebase-api-id
REACT_APP_FIREBASE_MEASURAMENT_ID=your-firebase-api-mesurament-id

REACT_APP_GOOGLE_BOOKS_APIKEY=your-google-books-api-key

REACT_APP_IP_STACK_APIKEY=your-ip-stack-api-key
```

<br/>

## Credits

* Book collection is provided by [Google](https://books.google.it/). </br>
* Ip search search is provided by [ipstack.com](https://ipstack.com/)

<br/>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)
