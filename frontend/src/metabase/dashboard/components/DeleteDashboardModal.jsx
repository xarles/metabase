import React, { Component, PropTypes } from "react";

import ModalContent from "metabase/components/ModalContent.jsx";

export default class DeleteDashboardModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        };
    }

    static propTypes = {
        dashboard: PropTypes.object.isRequired,

        onClose: PropTypes.func,
        onDelete: PropTypes.func
    };

    async deleteDashboard() {
        try {
            this.props.onDelete(this.props.dashboard);
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        var formError;
        if (this.state.error) {
            var errorMessage = "系统错误";
            if (this.state.error.data &&
                this.state.error.data.message) {
                errorMessage = this.state.error.data.message;
            } else {
                errorMessage = this.state.error.message;
            }

            // TODO: timeout display?
            formError = (
                <span className="text-error px2">{errorMessage}</span>
            );
        }

        return (
            <ModalContent
                title="删除当前仪表盘"
                closeFn={this.props.onClose}
            >
                <div className="Form-inputs mb4">
                    <p>您确定要删除当前仪表盘吗?</p>
                </div>

                <div className="Form-actions">
                    <button className="Button Button--danger" onClick={() => this.deleteDashboard()}>是</button>
                    <button className="Button Button--primary ml1" onClick={this.props.onClose}>否</button>
                    {formError}
                </div>
            </ModalContent>
        );
    }
}
