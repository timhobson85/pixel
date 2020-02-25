import React from 'react'
import { SketchPicker } from 'react-color';
import './ColorPicker.css'


class ColorPicker extends React.Component {

  state = {
    displayColorPicker: false,
    color: this.props.color,
    disableAlpha: true,
  };

  sendColorData = ( color ) => {
    this.setState({ color : color.hex})
    this.props.sendColorData(this.state.color)
  }

  showColorPicker = () => {
    let displayColorPicker = this.state.displayColorPicker
    this.setState({ displayColorPicker : !displayColorPicker })
  }


  render(){
    return(
      <div className='App'>
        <button
          id="colorPickerButton"
          style={{
            backgroundColor:`${this.state.color}`
          }}
          onClick={this.showColorPicker}
          >
          {
            this.state.displayColorPicker ?
            'hide'
            :
            'pick a color'
          }
        </button>
        <div
          id="currentColor"
          style={{
            backgroundColor: `${this.state.color}`
          }}
          />
        {
          this.state.displayColorPicker ?
          <SketchPicker
            color={this.state.color}
            onChange={this.sendColorData}
            onChangeComplete={ this.sendColorData}
            disableAlpha={this.state.disableAlpha}
            onMouseLeave={this.showColorPicker}
          />
          :
          <p>no</p>
        }
      </div>
    )
  }

} // Class

export default ColorPicker
