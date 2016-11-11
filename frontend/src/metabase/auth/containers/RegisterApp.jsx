/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";


import LogoIcon from 'metabase/components/LogoIcon.jsx';
import Register from 'metabase/auth/components/Register.jsx';


import * as authActions from "../auth";

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state, props) => {
    return {
        loginError:       state.auth && state.auth.loginError,
        user:             state.currentUser
    }
}
//Which action creators does it want to receive by props?
const mapDispatchToProps = {
    ...authActions //将authActions的属性（函数）展开到mapDispatchToProps
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RegisterApp extends Component {
  

    render() {
        return (
            <div>
                <nav className="nav-border-bottom">
                    <ul className="pl4 pr1 flex align-center">
                    <li>
                        <Link to="/" data-metabase-event={"Navbar;Logo"} className="NavItem cursor-pointer text-dark flex align-center my1 pb1 transition-background">
                            <LogoIcon className="text-dark m1"></LogoIcon>
                        </Link>
                    </li>
                    <li className="flex-align-right ">
                        <a data-metabase-event="" className="Button border-green float-right mx4" href="/auth/login" >登录</a>
                    </li>
                    </ul>
                </nav>

                <div className="wrapper wrapper--small">
                    <div className="full py4">
                   
                        <Register {...this.props}  />
                        
                    </div>
                </div>
            </div>
        );
    }
}
