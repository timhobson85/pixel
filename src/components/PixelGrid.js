import React from 'react'
import './PixelGrid.css';
import { cloneDeep } from 'lodash'
import ColorPicker from './ColorPicker'
import firebase from '../firebase.js'
import WebcamPage from './WebcamPage'


class PixelGrid extends React.Component {
  state = {
    image: [],
    row: 40,
    col: 100,
    color: "#000000",
    mouseDown: false,
    firstDraw: true,
    eyeDropperActive: false,
  };

  componentDidMount() {
    this.firebaseLastDrawListen();
    this.firebaseGridWasUpdatedListen()
    this.getPhotoFromFirebase();
  };

  activateEyeDropper = () => {
    this.setState({
      eyeDropperActive: true
    });
  };

  paintClick = (r, c, event) => {
    if (this.state.eyeDropperActive) {
      this.setState({
        color: event.target.style.backgroundColor,
        eyeDropperActive: false
      });
    } else {
    // let newImage = [...this.state.image]; // this is a shallow copy - use deep copy with lodash
    let newImage = cloneDeep(this.state.image);
    newImage[r].splice(c, 1, this.state.color );
    this.setState({
      image: newImage
    });
    this.firebaseSetLastDraw( r, c );
    this.firebaseSetPixel( r, c );
    }
  };

  paintMouseOver = (r, c) => {
    if (this.state.mouseDown) {
      this.firebaseSetLastDraw( r, c, this.state.color);
      this.firebaseSetPixel( r, c )
      let newImage = cloneDeep(this.state.image);
      newImage[r].splice(c, 1, this.state.color);
      this.setState({
        image: newImage
      });
    };
  };

  setMouseDown = (r, c) => {
    let newImage = cloneDeep(this.state.image);
    newImage[r].splice(c, 1, this.state.color );
    this.firebaseSetLastDraw( r, c, this.state.color);
    this.firebaseSetPixel( r, c );
    this.setState({
      image: newImage
    });
    this.setState({ mouseDown: true});
  };

  setMouseUp = () => {
    this.setState({ mouseDown: false});
  };

  // firebaseSetPixel = (r, c, color) => {
    // console.log('sending to firebase');
    // firebase.database().ref(`/grid/${r}-${c}`).set({
    //   row: r,
    //   col: c,
    //   color: color
    // });
  // }

  firebaseSetLastDraw = (r, c) => {
    firebase.database().ref('/lastDraw').set({
      row: r,
      col: c,
      color: this.state.color
    });
  };

  firebaseSetPixel = (c, r) => {
    firebase.database().ref(`/grid/${r}-${c}`).set({
      row: r,
      col: c,
      color: this.state.color
    });
  };

  firebaseLastDrawListen = () => {
    let listen = firebase.database().ref('/lastDraw');
    listen.on('value', (snapshot) => {
      let data = snapshot.val();
      if (this.state.firstDraw === false) {
        this.firebasePaint( data.row, data.col, data.color );
      };
      this.setState({ firstDraw: false });
    });
  };

  firebaseGridWasUpdatedListen = () => {
    let listen = firebase.database().ref('/gridWasUpdated');
    listen.on('value', (snapshot) => {
      let data = snapshot.val()
      // console.log('firebaseListen', data.row, data.col);
      // console.log(data);
      this.getPhotoFromFirebase()
    })
  }

  firebasePaint = ( r, c, color ) => {
    let newImage = cloneDeep(this.state.image);
    newImage[r].splice(c, 1, color )
    this.setState({
      image: newImage
    });
  };

  getPhotoFromFirebase = () => {
    firebase.database().ref('/grid').once('value')
    // .then((pixels) => console.log(pixels.val()))
    .then((pixels) => {
      const pix = Object.values( pixels.val() );
      const output = Array(40).fill(null).map( el => new Array(100) );
      let rows = 40; let cols = 100;
      for(let i = 0; i < pix.length; i++){
        const {row, col, color} = pix[i];
          output[col][row] = color;
      };
      this.setState({ image: output });
    });
  };

  firebaseEmptyGrid = () => {
    firebase.database().ref('/grid').remove();
  };

  colorPickerData = ( data ) => {
    this.setState({ color : data});
  };


  render(){
    const { image } = this.state;
    return(
      <div className='App'>
        <h2>PixelCanvas02</h2>
        {
          this.state.image.length > 1 ?
          <div
            className="pixelGrid"
            onMouseLeave={this.setMouseUp}
          >
          {
          image.map((row, i) => (
            <div
              className="row"
              style={{
                height: `${100 / image[i].length}%`
              }}
              >
              {
                row.map( (color, j ) => (
                  <div
                    className="pixel"
                    style={{
                      backgroundColor: image[i][j] || 'rgb(70, 70, 70)',
                      width: `${100 / image[i].length}%`,
                      paddingBottom: `${100 / image[i].length}%`
                    }}
                    onClick={(e) => this.paintClick(i, j, e)}
                    onMouseUp={this.setMouseUp}
                    />)
                  )
                }
              </div>
            ))
          }
          </div>
          :
          <p>loading...</p>
        }
        <ColorPicker
          color={this.state.color}
          sendColorData={this.colorPickerData}
        />
      <button onClick={this.activateEyeDropper}>eyedropper</button>
        <br/>
        <br/>
      </div>
    )
  }
} // Class

export default PixelGrid

// row/col inputs
// <h4>testinput</h4>
// <label>row</label>
// <input type="number" min="1" max="100" name="row" defaultValue={this.state.row} onChange={this.handleChangeSelect}/>
// <label>col</label>
// <input type="number" min="1" max="100" name="col" defaultValue={this.state.col} onChange={this.handleChangeSelect}/>
// <h4>endtestinput</h4>
// <label> row </label>
// <input type="text" name="row" onChange={this.handleChange} /> <br/>
// <label> col </label>
// <input type="text" name="col" onChange={this.handleChange} /> <br/>
// <button onClick={this.createGrid}>click</button> <br/>

// handleChange = (e) => {
//   this.setState({ [e.target.name] : e.target.value })
// }
//
// handleChangeSelect = (e) => {
//   console.log(this.state.row, this.state.col);
//   this.setState({ [e.target.name] : e.target.value })
//   let image = []
//   for (var i = 0; i < this.state.row; i++) {
//     image[i] = []
//     for (var j = 0; j < this.state.col; j++) {
//       image[i][j] =  null
//     }
//   }
//   this.setState({ image })
// }

// createGrid = () => {
//   console.log(this.state.row, this.state.col);
//   let image = []
//   for (var i = 0; i < this.state.row; i++) {
//     image[i] = []
//     for (var j = 0; j < this.state.col; j++) {
//       image[i][j] =  null
//       // this.firebaseSetPixel( i, j ) // this was to seed grid
//     }
//   }
//   this.setState({ image })
// }


// click and drag draw handlers
// onMouseDown={() => this.setMouseDown(i, j)}
// onMouseOver={() => this.paintMouseOver(i, j)}
// onMouseUp={this.setMouseUp}
