import React, { Component } from 'react';
import logo from '../images/logo.png';


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            rePassword: ''
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
          <div className='form-group jumbotron bg-dark border rounded border-light'>
            <form onSubmit={ e => this.props.handleSignup(e, this.state) }>
              <div className='row justify-content-center align-items-center mx-auto'>
                <h1>Welcome to Stock Trade<span className='text-warning'>R</span></h1>
              </div>
              <div className='card bg-light w-50 mx-auto text-dark my-5 py-3'>
                <div className='row justify-content-center align-items-center'>
                  <img src={logo} alt='logo' />
                </div>
                <div className='row justify-content-center align-items-center mx-auto'>
                  <label className='p-1 ml-5 mr-3' htmlFor="email">Email</label>
                  <input
                      type="email"
                      name="email"
                      value={ this.state.email }
                      onChange={ this.handleChange }
                  />
                </div>
                <div className='row justify-content-center align-items-center m-auto'>
                  <label className='p-1 mr-1 ml-4' htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={ this.state.username }
                      onChange={ this.handleChange }
                    />
                </div>
                <div className='row justify-content-center align-items-center m-auto'>
                  <label className='p-1 mr-1 ml-4' htmlFor="password">Password</label>
                  <input
                    className='ml-1'
                    type="password"
                    name="password"
                    value={ this.state.password }
                    onChange={ this.handleChange }
                  />
                </div>
                <div className='row justify-content-center align-items-center m-auto'>
                  <label className='p-1 mr-1 ml-4' htmlFor="re-password">Password</label>
                  <input
                    className='ml-1'
                    type="password"
                    name="rePassword"
                    value={ this.state.rePassword }
                    onChange={ this.handleChange }
                  />
                </div>
                <div className='row justify-content-center align-items-center mx-auto mt-3 w-50'>
                  <button
                    type="submit"
                    className='btn btn-primary btn-block'>
                    Signup
                  </button>
                </div>
              </div>
            </form>
            <div className='card bg-light w-50 mx-auto text-dark my-5 py-3'>
              <div className='row justify-content-center align-items-center mx-auto mt-3'>
              <p>Already a user ?</p>
              </div>
              <div className='row justify-content-center align-items-center mx-auto w-50'>
                <button
                  className='btn btn btn-secondary btn-block'
                  onClick={ this.props.handleSignupPage }>
                   Login
                </button>
              </div>
            </div>
          </div>
        );
    }
}

export default Signup;
