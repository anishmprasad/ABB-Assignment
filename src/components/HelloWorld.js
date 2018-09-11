import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import {debounce} from 'throttle-debounce';
import { 
  initialAction,
  matrixUpdate
} from 'actions/HelloWorld'
import { bindActionCreators } from "redux";
import './Helloworld.scss'
import {matrix} from "./constants"

class HelloWorld extends Component {
    constructor(props){
        super(props)
        this.state = {
          input : ""
        }
    }
    
    componentWillMount(){
      this.props.matrix && this.props.initialAction(this.props.matrix)
    }
    selectedAction(buttonType){
      if ( String( matrix[this.props.selected] && matrix[this.props.selected][buttonType] ) ){
        return matrix[this.props.selected][buttonType]
      }else{
        this.props.matrix && this.props.initialAction(this.props.matrix)        
      }
    }
    clickAction = (buttonType) => {
      // console.log(buttonType)
      // console.log('matrix',matrix)
      // console.log('selected ->',this.props.selected)
      // console.log('neignbours => ',matrix[this.props.selected])
      // console.log('current ->',matrix[this.props.selected][buttonType])
      let selected = this.props.selected;
      let current = this.selectedAction(buttonType)
      this.props.matrixUpdate(selected,current)
      // this.props.selectedUpdate(8)
    }
    
    renderArray(k = []){
      // let k = [-100,-200,-300,0,1,2,4]
      for(let i = 0 ; i<k.length ;i += 1){
        if (k[i] >= 1){
          let p = k[i] + 1
          if(k.indexOf( p) == -1 ){
            return p
          }
        }
      }
    }
    removeLastComma(str) {
      return str.replace(/,(\s+)?$/, '');
    }
    remote = () => {
      return(
        <div className="remote-navigator">
          <div className="remote">
            <div 
              className="remote-nav left"
              onClick={ () => this.clickAction('left')}
            >
            left
            </div>
            <div
              className="remote-nav right"
              onClick={ () => this.clickAction('right')}
            >
              right
            </div>
            <div
              className="remote-nav top"
              onClick={ () => this.clickAction('top')}            
            >
              top
            </div>
            <div
              className="remote-nav bottom"
              onClick={ () => this.clickAction('bottom')}        
            >
              bottom
            </div>
          </div>
        </div>
      )
    }
    renderMatrix = (value,index) => {
      return(
        <div 
          key={`matrix-${index}`}
          className={value.selected ? "box selected" : "box"}
        >
          {index}
        </div>
      )
    }
    makeTableHTML(myArray) {
      var result = "<table border=1>";
      for (var i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (var j = 0; j < myArray[i].length; j++) {
          result += "<td>" + myArray[i][j] + "</td>";
        }
        result += "</tr>";
      }
      result += "</table>";

      return result;
    }
    matrix(numrows, numcols, initial) {
      var arr = [];
      for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
          columns[j] = initial;
        }
        arr[i] = columns;
      }
      return arr;
    }
    onChange = e => { 
      let k = e.target.value
      this.setState({input : k})
      // var array = JSON.parse('[' + k + ']');
    }
    parseArray = e => {
      try {
        return this.renderArray(JSON.parse('[' + this.removeLastComma(String(this.state.input)) + ']'))
      } catch (error) {
        console.log("please add valid number")
      }
    }
    render() {
      // console.log(this.renderArray(JSON.parse('[' + this.removeLastComma(String(this.state.input)) + ']')))
        return (
          <div>
            <h1>HelloWorld</h1>
            {/* <img src={image_path("/react-image.png")} alt={"react-image"}/> */}
            <input
              type="text"
              onChange={this.onChange}
              value={this.state.input || ""}
              placeholder="use numbers only"
            />
            <div>
              {/* {this.renderArray([-100, -200, -300, 0, 1, 2, 4])} */}
              {'output value -> '}
              {this.parseArray()}
            </div>
            <div className="remote-container">
              {this.remote()}
              <div className="container">
                {this.props.matrix.map(this.renderMatrix)}
              </div>
            </div>
          </div>
        )
      }
}
HelloWorld.defaultProps = {
  matrix : [
    {
      id : 0,
      selected : false,
    }, {
      id: 1,
      selected: false,
    }, {
      id: 2,
      selected: false,
    }, {
      id: 3,
      selected: false,
    }, {
      id: 4,
      selected: true,
    }, {
      id: 5,
      selected: false,
    }, {
      id: 6,
      selected: false,
    }, {
      id: 7,
      selected: false,
    }, {
      id: 8,
      selected: false,
    },

  ]
}
function mapStateToProps(state) {
  const { matrix, selected } = state.Helloworld
  return {
    selected: selected && selected.id,
    matrix : matrix
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { initialAction, matrixUpdate },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HelloWorld);  