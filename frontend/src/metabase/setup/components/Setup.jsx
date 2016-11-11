/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import LogoIcon from 'metabase/components/LogoIcon.jsx';
import NewsletterForm from 'metabase/components/NewsletterForm.jsx';
import MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";

import UserStep from './UserStep.jsx';
import DatabaseStep from './DatabaseStep.jsx';
import PreferencesStep from './PreferencesStep.jsx';

const WELCOME_STEP_NUMBER = 0;
const USER_STEP_NUMBER = 1;
const DATABASE_STEP_NUMBER = 2;
const PREFERENCES_STEP_NUMBER = 3;


export default class Setup extends Component {
    static propTypes = {
        activeStep: PropTypes.number.isRequired,
        setupComplete: PropTypes.bool.isRequired,
        userDetails: PropTypes.object,
        setActiveStep: PropTypes.func.isRequired,
    }

    completeWelcome() {
        this.props.setActiveStep(USER_STEP_NUMBER);
        MetabaseAnalytics.trackEvent('Setup', 'Welcome');
    }

    completeSetup() {
        MetabaseAnalytics.trackEvent('Setup', 'Complete');
    }

    renderFooter() {
        const { tag } = MetabaseSettings.get('version');
        return (
            <div className="SetupHelp bordered border-dashed p2 rounded mb4" >
                powered by techbrain, <a className="link" href={"http://www.metabase.com/docs/"+tag+"/setting-up-metabase"} target="_blank">our getting started guide</a> is just a click away.
            </div>
        );
    }
//    <div className="absolute z1 bottom left right">
//      <div className="inline-block">
//          {this.renderFooter()}
//      </div>
//    </div>
    render() {
        let { activeStep, setupComplete, userDetails } = this.props;

        if (activeStep === WELCOME_STEP_NUMBER) {
            return (
                <div className="relative full-height flex flex-full layout-centered">
                    <div className="wrapper wrapper--trim text-centered">
                        <LogoIcon className="text-brand mb4" width={89} height={118} ></LogoIcon>
                        <div className="relative z2 text-centered ml-auto mr-auto mt4" style={{maxWidth: 550}}>
                            <h1 style={{fontSize: '2.2rem'}} className="text-brand">不止表达，更为发现！</h1>
                            <p className="text-body">欢迎使用TechBrain数据可视化系统【个人版】</p>
                            <button className="Button Button--primary mt4" onClick={() => (this.completeWelcome())}>开始使用</button>
                        </div>
                       
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <nav className="SetupNav text-brand py2 flex layout-centered">
                        <LogoIcon width={41} height={51}></LogoIcon>
                    </nav>

                    <div className="wrapper wrapper--small">
                        <div className="SetupSteps full">

                            <UserStep {...this.props} stepNumber={USER_STEP_NUMBER} />
                            <DatabaseStep {...this.props} stepNumber={DATABASE_STEP_NUMBER} />
                            <PreferencesStep {...this.props} stepNumber={PREFERENCES_STEP_NUMBER} />

                            { setupComplete ?
                                <section className="SetupStep rounded SetupStep--active flex flex-column layout-centered p4">
                                    <h1 style={{fontSize: "xx-large"}} className="text-light pt2 pb2">You're all set up!</h1>
                                    <div className="pt4">
                                        <NewsletterForm initialEmail={userDetails && userDetails.email} />
                                    </div>
                                    <div className="pt4 pb2">
                                        <Link to="/?new" className="Button Button--primary" onClick={this.completeSetup.bind(this)}>Take me to Metabase</Link>
                                    </div>
                                </section>
                            : null }
                            <div className="text-centered">
                                {this.renderFooter()}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
