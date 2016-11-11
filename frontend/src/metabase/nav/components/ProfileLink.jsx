import React, { Component, PropTypes } from 'react';
import { Link } from "react-router";

import OnClickOutsideWrapper from 'metabase/components/OnClickOutsideWrapper';

import cx from 'classnames';
import _ from "underscore";
import { capitalize } from "metabase/lib/formatting";

import MetabaseSettings from "metabase/lib/settings";
import Modal from "metabase/components/Modal.jsx";
import Logs from "metabase/components/Logs.jsx";

import UserAvatar from 'metabase/components/UserAvatar.jsx';
import Icon from 'metabase/components/Icon.jsx';
import LogoIcon from 'metabase/components/LogoIcon.jsx';

export default class ProfileLink extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            dropdownOpen: false,
            modalOpen: null
        };

        _.bindAll(this, "toggleDropdown", "closeDropdown", "openModal", "closeModal");
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        context: PropTypes.string.isRequired,
    };

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    closeDropdown() {
        this.setState({ dropdownOpen: false });
    }

    openModal(modalName) {
        this.setState({ dropdownOpen: false, modalOpen: modalName });
    }

    closeModal() {
        this.setState({ modalOpen: null });
    }

    render() {
        const { user, context } = this.props;
        const { modalOpen, dropdownOpen } = this.state;
        const { tag, date, ...versionExtra } = MetabaseSettings.get('version');

        let dropDownClasses = cx({
            'NavDropdown': true,
            'inline-block': true,
            'cursor-pointer': true,
            'open': dropdownOpen,
        });

        return (
            <div className={dropDownClasses}>
                <a data-metabase-event={"Navbar;Profile Dropdown;Toggle"} className="NavDropdown-button NavItem flex align-center p2 transition-background" onClick={this.toggleDropdown}>
                    <div className="NavDropdown-button-layer">
                        <div className="flex align-center">
                            <UserAvatar user={user} style={{backgroundColor: 'transparent'}}/>
                            <Icon name="chevrondown" className="Dropdown-chevron ml1" size={8} />
                        </div>
                    </div>
                </a>

                { dropdownOpen ?
                    <OnClickOutsideWrapper handleDismissal={this.closeDropdown}>
                        <div className="NavDropdown-content right">
                            <ul className="NavDropdown-content-layer">
                                <li>
                                    <Link to="/user/edit_current" data-metabase-event={"Navbar;Profile Dropdown;Edit Profile"} onClick={this.closeDropdown} className="Dropdown-item block text-white no-decoration">
                                        账户设置
                                    </Link>
                                </li>

                                { user.is_superuser && context !== 'admin' ?
                                    <li>
                                        <Link to="/admin" data-metabase-event={"Navbar;Profile Dropdown;Enter Admin"} onClick={this.closeDropdown} className="Dropdown-item block text-white no-decoration">
                                            管理面板
                                        </Link>
                                    </li>
                                : null }

                                { user.is_superuser && context === 'admin' ?
                                    <li>
                                        <Link to="/" data-metabase-event={"Navbar;Profile Dropdown;Exit Admin"} onClick={this.closeDropdown} className="Dropdown-item block text-white no-decoration">
                                            退出管理
                                        </Link>
                                    </li>
                                : null }

                                <li>
                                    <a data-metabase-event={"Navbar;Profile Dropdown;Help "+tag} className="Dropdown-item block text-white no-decoration" href={"http://zpudata.com/feedback/feedback"} target="_blank">
                                        帮助
                                    </a>
                                </li>

                                { user.is_superuser &&
                                    <li>
                                        <a data-metabase-event={"Navbar;Profile Dropdown;Debugging "+tag} onClick={this.openModal.bind(this, "logs")} className="Dropdown-item block text-white no-decoration">
                                           系统日志
                                        </a>
                                    </li>
                                }

                                <li>
                                    <a data-metabase-event={"Navbar;Profile Dropdown;About "+tag} onClick={this.openModal.bind(this, "about")} className="Dropdown-item block text-white no-decoration">
                                        关于
                                    </a>
                                </li>

                                <li className="border-top border-light">
                                    <Link
                                        to="/auth/logout"
                                        data-metabase-event={"Navbar;Profile Dropdown;Logout"}
                                        className="Dropdown-item block text-white no-decoration"
                                    >
                                        退出登录
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </OnClickOutsideWrapper>
                : null }

                { modalOpen === "about" ?
                    <Modal className="Modal Modal--small" onClose={this.closeModal}>
                        <div className="px4 pt4 pb2 text-centered relative">
                            <span className="absolute top right p4 text-normal text-grey-3 cursor-pointer" onClick={this.closeModal}>
                                <Icon name={'close'} size={16} />
                            </span>
                            <div className="text-brand pb2">
                                <LogoIcon width={48} height={48} />
                            </div>
                            <h2 style={{fontSize: "1.75em"}} className="text-dark">感谢使用TechBrain Basic!</h2>
                           
                        </div>
                       
                    </Modal>
                : modalOpen === "logs" ?
                    <Modal className="Modal Modal--wide" onClose={this.closeModal}>
                        <Logs onClose={this.closeModal} />
                    </Modal>
                : null }
            </div>
        );
    }
}
