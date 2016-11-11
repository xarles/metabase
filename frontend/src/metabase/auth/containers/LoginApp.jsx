import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import { Link } from "react-router";
import { connect } from "react-redux";

import cx from "classnames";

//import AuthScene from "../components/AuthScene.jsx";
import SSOLoginButton from "../components/SSOLoginButton.jsx";
import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";
import LogoIcon from "metabase/components/LogoIcon.jsx";
import Settings from "metabase/lib/settings.js";


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
export default class LoginApp extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            credentials: {},
            valid: false
        }
        
//        for(var i in props){
//            console.log(i+":"+props[i]);
//        }
//        
//        console.log("==============mapDispatchToProps======");
//        
//        for(var s in mapDispatchToProps){
//            console.log(s+":"+mapDispatchToProps[s]);
//        }
    }

    validateForm() {
        let { credentials } = this.state;

        let valid = true;

        if (!credentials.email || !credentials.password) {
            valid = false;
        }

        if (this.state.valid !== valid) {
            this.setState({ valid });
        }
        
        
    }

    componentDidMount() {

        this.validateForm();

        const { loginGoogle, location } = this.props;

        let ssoLoginButton = findDOMNode(this.refs.ssoLoginButton);

        function attachGoogleAuth() {
            // if gapi isn't loaded yet then wait 100ms and check again. Keep doing this until we're ready
            if (!window.gapi) {
                window.setTimeout(attachGoogleAuth, 100);
                return;
            }
            try {
                window.gapi.load('auth2', () => {
                  let auth2 = window.gapi.auth2.init({
                      client_id: Settings.get('google_auth_client_id'),
                      cookiepolicy: 'single_host_origin',
                  });
                  auth2.attachClickHandler(ssoLoginButton, {},
                      (googleUser) => loginGoogle(googleUser, location.query.redirect),
                      (error) => console.error('There was an error logging in', error)
                  );
                })
            } catch (error) {
                console.error('Error attaching Google Auth handler: ', error);
            }
        }
        attachGoogleAuth();
    }

    componentDidUpdate() {
        this.validateForm();
    }

    onChange(fieldName, fieldValue) {
        this.setState({ credentials: { ...this.state.credentials, [fieldName]: fieldValue }});
    }

    formSubmitted(e) {
        e.preventDefault();

        let { login, location } = this.props;
        let { credentials } = this.state;

        login(credentials, location.query.redirect);
    }

    render() {

        const { loginError } = this.props;

        return (
            
             
            <div className="full-height full bg-white flex flex-column flex-full">
                <nav className={cx(" nav-border-bottom", this.props.className)}>
                    <ul className="pl4 pr1 flex align-center">
                    <li>
                        <Link to="/" data-metabase-event={"Navbar;Logo"} className="NavItem cursor-pointer text-dark flex align-center my1 pb1 transition-background">
                            <LogoIcon className="text-dark m1"></LogoIcon>
                        </Link>
                    </li>
                    <li className="flex-align-right ">
                        <a data-metabase-event="" className="Button border-green float-right mx4" href="/auth/register" >注册</a>
                    </li>
                    </ul>
                </nav>
                <div className="Login-wrapper mt4 md-mt8 wrapper wrapper--trim ">
                    
                    <div className="Login-content ">
                        <form className="Form-new bg-white bordered rounded shadowed" name="form" onSubmit={(e) => this.formSubmitted(e)} noValidate>
                            <h3 className="Login-header Form-offset">用户登录</h3>

                            { Settings.ssoEnabled() &&
                                <div className="mx4 mb4 py3 border-bottom relative">
                                    <SSOLoginButton provider='google' ref="ssoLoginButton"/>
                                    {/*<div className="g-signin2 ml1 relative z2" id="g-signin2"></div>*/}
                                    <div className="mx1 absolute text-centered left right" style={{ bottom: -8 }}>
                                        <span className="text-bold px3 py2 text-grey-3 bg-white">或者</span>
                                    </div>
                                </div>
                            }

                            <FormMessage formError={loginError && loginError.data.message ? loginError : null} ></FormMessage>

                            <FormField key="email" fieldName="email" formError={loginError}>
                                <FormLabel title={"邮件地址"}  fieldName={"email"} formError={loginError} />
                                <input className="Form-input Form-offset full py1" name="email" placeholder="youlooknicetoday@email.com" type="text" onChange={(e) => this.onChange("email", e.target.value)} autoFocus />
                                <span className="Form-charm"></span>
                            </FormField>

                            <FormField key="password" fieldName="password" formError={loginError}>
                                <FormLabel title={"密码"}  fieldName={"password"} formError={loginError} />
                                <input className="Form-input Form-offset full py1" name="password" placeholder="***..." type="password" onChange={(e) => this.onChange("password", e.target.value)} />
                                <span className="Form-charm"></span>
                            </FormField>

                            <div className="Form-field">
                                <ul className="Form-offset">
                                    <input name="remember" type="checkbox" defaultChecked /> <label className="inline-block">记住登录状态:</label>
                                </ul>
                            </div>

                            <div className="Form-actions p2 Grid Grid--full md-Grid--1of2">
                                <button className={cx("Button Grid-cell", {'Button--primary': this.state.valid})} disabled={!this.state.valid}>
                                    登录
                                </button>
                                <Link to={"/auth/forgot_password"+(this.state.credentials.email ? "?email="+this.state.credentials.email : "")} className="Grid-cell py2 sm-py0 text-grey-3 md-text-right text-centered flex-full link" onClick={(e) => { window.OSX ? window.OSX.resetPassword() : null }}>忘记密码了？</Link>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        );
    }
}

    
//                                <AuthScene />