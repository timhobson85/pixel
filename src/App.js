import React from 'react';
import './App.css';
import {
  Route,
  Link,
  HashRouter as Router
} from 'react-router-dom'
import PixelGrid from './components/PixelGrid'
import Gallery from './components/Gallery'


class App extends React.Component {


  handleGalleryClick = () => {
    // console.log('galleryClick');
    // this.history.push('/gallery')
  }

  render(){
    return (
      <div className="App">
        <Router>
        <Link to="/gallery">
          <button id="galleryButton">gallery</button>
        </Link>
        <Link to="/pixelgrid">
          <button id="pixelGridButton">pixelgrid</button>
        </Link>
        <Route exact path="/gallery" component={Gallery} />
        <Route exact path="/pixelgrid" component={PixelGrid} />
        </Router>
      </div>
    )
  }

};

export default App;
