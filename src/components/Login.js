import React, { Component } from 'react';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
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

    render() {
        return (
          <div className='form-group jumbotron bg-dark mt-5 border rounded border-light' >
            <form onSubmit={ e => this.props.handleLogin(e, this.state) }>
              <div className='row justify-content-center align-items-center mx-auto my-5'>
                <h1>Welcome to Stock Trade<span className='text-warning'>R</span></h1>
              </div>
              <div className='card bg-light w-50 mx-auto text-dark my-5 py-3'>
                <div className='row justify-content-center align-items-center mx-auto'>
                  <label className='p-1 mr-1' htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={ this.state.username }
                    onChange={ this.handleChange }
                  />
                </div>
                <div className='row justify-content-center align-items-center m-auto'>
                  <label className='p-1 mr-2' htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={ this.state.password }
                    onChange={ this.handleChange }
                  />
                </div>
                <div className='row justify-content-center align-items-center mx-auto mt-3 w-50'>
                  <button className='btn btn-primary btn-block' type="submit">
                    Login
                  </button>
                </div>
              </div>
            </form>
            <div className='card bg-light w-50 mx-auto text-dark my-5 py-3'>
              <div className='row justify-content-center align-items-center mx-auto mt-3'>
                <p>Not a member?</p>
              </div>
              <div className='row justify-content-center align-items-center mx-auto w-50'>
                <button
                  className='btn btn btn-secondary btn-block'
                  onClick={ this.props.handleSignupPage }>
                   Signup
                </button>
              </div>
              <div className='row justify-content-center align-items-center mx-auto mt-3'>
                <p>It's <strong>free</strong> and <strong>easy</strong>!</p>
              </div>
            </div>
          </div>
        );
    }
}

export default Login;
