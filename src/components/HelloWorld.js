import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import {debounce} from 'throttle-debounce';
import { 
  initialAction,
  matrixUpdate,
  matrixAction,
  selectedDiamentionalUpdate
} from 'actions/HelloWorld'
import { bindActionCreators } from "redux";
import './Helloworld.scss'
import {matrix} from "./constants"

class HelloWorld extends Component {
    constructor(props){
        super(props)
        this.state = {
          input : "",
          rows : 3,
          columns : 3
        }
    }
    
    componentWillMount(){
      this.props.matrix && this.props.initialAction(this.props.matrix)
      this.props.matrixAction(this.mapPostitonMatrix())
    }
    selectedAction(buttonType){
      if ( String( matrix[this.props.selected] && matrix[this.props.selected][buttonType] ) ){
        return matrix[this.props.selected][buttonType]
      }else{
        this.props.matrix && this.props.initialAction(this.props.matrix)        
      }
    }
    matrixselected(buttonType){
      if ( String(this.props.matrixDiamentional[Number(this.props.selectedDiamentional)][buttonType]) ){
        // console.log('asdasdsad', Number(this.props.matrixDiamentional[Number(this.props.selectedDiamentional)][buttonType]))
        return Number(this.props.matrixDiamentional[Number(this.props.selectedDiamentional)][buttonType])
      }
    }
    clickAction = (buttonType) => {
      let selected = this.props.selected;
      let current = this.selectedAction(buttonType)
      this.props.matrixUpdate(selected,current)
      let matrixselect = this.matrixselected(buttonType)
      this.props.selectedDiamentionalUpdate(matrixselect)
    }
    
    renderArray(k = []){
      // let k = [-100,-200,-300,0,1,2,4]
      for(let i = 0 ; i<k.length ;i += 1){
        // console.log(k[i])
        // console.log(k[i] >= 1)
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
          result += `<td class="${ Number(this.props.selectedDiamentional) == myArray[i][j] ? "selected" : "tabledata" }">` + myArray[i][j] + "</td>";
        }
        result += "</tr>";
      }
      result += "</table>";

      return result;
    }
    matrix(numrows, numcols, initial = -1 ) {
      var arr = [];
      for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
          columns[j] = initial += 1
        }
        arr[i] = columns;
      }
      return arr;
    }
    top = (twoDia,i,j) => {
      let diapoint
      switch (i) {
        case 0:
          diapoint = twoDia.length - 1
          break;
        default:
          diapoint = i - 1
          break;
      }
      return twoDia[diapoint][j]
    }
    left = (twoDia,i,j) => {
      let diapoint
      switch (j) {
        case 0:
          diapoint = twoDia.length - 1
          break;
        default:
          diapoint = j - 1
          break;
      }
      return twoDia[i][diapoint]
    }
    right = (twoDia,i,j) => {
      let diapoint
      switch (j) {
        case 0:
          diapoint = j + 1 
          break;
        default:
          if (j == (twoDia.length - 1)){
            diapoint = 0
          }else{
            diapoint = twoDia.length - 1     
          }     
          break;
      }
      return twoDia[i][diapoint]
    }
    bottom = (twoDia, i, j) => {
      let diapoint
      switch (i) {
        case 0:
          diapoint = i + 1
          break;
        default:
          if (i == (twoDia.length - 1)) {
            diapoint = 0
          } else {
            diapoint = twoDia.length - 1
          }
          break;
      }
      return twoDia[diapoint][j]
    }
    mapPostitonMatrix(){
      let twoDia = this.matrix(this.state.rows, this.state.columns)
      console.log('mapPostitonMatrix',twoDia)
      let postition = {}
      for (var i = 0; i < twoDia.length; i++) {
        for (var j = 0; j < twoDia[i].length; j++) {
          console.log(twoDia[i][j], '->', i, j, '->', twoDia.length, twoDia[0].length)
          postition[twoDia[i][j]] = {
            "top": this.top(twoDia,i,j) , // 2 0 1 - 0 1 2
            "right": this.right(twoDia, i, j), // 0 1 2 - 1 2 0
            "bottom": this.bottom(twoDia,i,j) , // 0 1 2 - 1 2 0
            "left": this.left(twoDia, i, j) // 1 2 0 - 0 1 2
          }
          
          // console.log(postition);
        }
      }
      console.log(postition);
      return postition
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
    createMarkup() {
      // console.log(this.matrix(3, 3, 0));
      return { __html: this.makeTableHTML(this.matrix(this.state.rows, this.state.columns)) };
    }
    render() {
      this.mapPostitonMatrix()
        return (
          <div>
            <h1>Assignment</h1>
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
              <div className="matrixtable" dangerouslySetInnerHTML={this.createMarkup()} />
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
  console.log(state)
  const { matrix, selected, selectedDiamentional, matrixDiamentional } = state.Helloworld
  return {
    selected: selected && selected.id,
    matrix : matrix,
    selectedDiamentional,
    matrixDiamentional
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { initialAction, matrixUpdate, matrixAction, selectedDiamentionalUpdate },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HelloWorld);  