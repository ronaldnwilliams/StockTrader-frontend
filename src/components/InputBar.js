import React, { Component } from 'react';

class InputBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
          inputValue: ''
      };
  }

  handleChange = e => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState(prevstate => {
          const newState = {...prevstate };
          newState[name] = value;
          return newState;
      });
  }

  handleInputBarSubmit = (e, inputValue) => {
    e.preventDefault();
    this.props.handleSubmit(inputValue);
    this.setState({ inputValue: ''});
  }

  render() {
      return (
        <form
          className='form-inline'
          onSubmit={e => this.handleInputBarSubmit(e, this.state.inputValue)}
          >
          <div className='form-group'>
            <input
              className='p-1 mr-1'
              autoComplete='off'
              type="text"
              name="inputValue"
              placeholder={ this.props.placeholder }
              value={ this.state.inputValue }
              onChange={ this.handleChange }
            />
            <button
              type="submit"
              className={ this.props.buttonValue === 'Buy' ? 'btn btn-success' : 'btn btn-light'}>
              { this.props.buttonValue }
            </button>
          </div>
        </form>
      );
  }
}

export default InputBar;
