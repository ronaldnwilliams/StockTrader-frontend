import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import InputBar from './InputBar';


class SiteNav extends Component {
  render() {
    if (this.props.loggedIn) {
        return (
          <nav className='navbar d-flex bg-dark mb-5 w-100'>
            {
              this.props.accountPage
                ? <button className='btn btn-link float-left'><span className='text-white'>Account</span></button>
                : <button className='btn btn-link float-left' onClick={ this.props.handleAccountPage }>
                   <span className='text-white'>Account</span>
                 </button>
             }
             <h3>Stock Trade<span className='text-warning'>R</span></h3>
            <button
              className='btn btn-link'
              onClick={ this.props.handleLogout }>
               <span className='text-white'>Logout</span>
             </button>
          </nav>
        );
    } else {
        return (
          <nav className='navbar d-flex justify-content-end'>
            { this.props.signupPage
                ? <button
                    className='btn btn-link text-white'
                    onClick={ this.props.handleSignupPage }>
                      Login
                  </button>
                : <button
                    className='btn btn-link text-white'
                    onClick={ this.props.handleSignupPage }>
                      Signup
                  </button>
              }
          </nav>
        );
    }
  }
}

export default SiteNav;
