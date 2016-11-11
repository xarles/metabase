import React, { Component, PropTypes } from "react";

import ActionButton from "metabase/components/ActionButton.jsx";
import AddToDashSelectQuestionModal from "./AddToDashSelectQuestionModal.jsx";
import DeleteDashboardModal from "./DeleteDashboardModal.jsx";
import RefreshWidget from "./RefreshWidget.jsx";
import Header from "metabase/components/Header.jsx";
import HistoryModal from "metabase/components/HistoryModal.jsx";
import FullscreenIcon from "metabase/components/icons/FullscreenIcon.jsx";
import Icon from "metabase/components/Icon.jsx";
import ModalWithTrigger from "metabase/components/ModalWithTrigger.jsx";
import NightModeIcon from "metabase/components/icons/NightModeIcon.jsx";
import Tooltip from "metabase/components/Tooltip.jsx";

import ParametersPopover from "./parameters/ParametersPopover.jsx";
import Popover from "metabase/components/Popover.jsx";

import cx from "classnames";

export default class DashboardHeader extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            modal: null,
        };
    }

    static propTypes = {
        dashboard: PropTypes.object.isRequired,
        revisions: PropTypes.object.isRequired,
        isEditing: PropTypes.bool.isRequired,
        isFullscreen: PropTypes.bool.isRequired,
        isNightMode: PropTypes.bool.isRequired,

        refreshPeriod: PropTypes.number,
        refreshElapsed: PropTypes.number,

        addCardToDashboard: PropTypes.func.isRequired,
        deleteDashboard: PropTypes.func.isRequired,
        fetchCards: PropTypes.func.isRequired,
        fetchDashboard: PropTypes.func.isRequired,
        fetchRevisions: PropTypes.func.isRequired,
        revertToRevision: PropTypes.func.isRequired,
        saveDashboard: PropTypes.func.isRequired,
        setDashboardAttribute: PropTypes.func.isRequired,
        onEditingChange: PropTypes.func.isRequired,
        setRefreshPeriod: PropTypes.func.isRequired,

        onNightModeChange: PropTypes.func.isRequired,
        onFullscreenChange: PropTypes.func.isRequired
    };

    onEdit() {
        this.props.onEditingChange(true);
    }

    onDoneEditing() {
        this.props.onEditingChange(false);
    }

    onRevert() {
        this.props.fetchDashboard(this.props.dashboard.id, this.props.location.query);
    }

    async onSave() {
        await this.props.saveDashboard(this.props.dashboard.id);
        this.onDoneEditing();
    }

    async onCancel() {
        this.onRevert();
        this.onDoneEditing();
    }

    async onDelete() {
        await this.props.deleteDashboard(this.props.dashboard.id);
        this.props.onChangeLocation("/");
    }

    // 1. fetch revisions
    onFetchRevisions({ entity, id }) {
        return this.props.fetchRevisions({ entity, id });
    }

    // 2. revert to a revision
    onRevertToRevision({ entity, id, revision_id }) {
        return this.props.revertToRevision({ entity, id, revision_id });
    }

    // 3. finished reverting to a revision
    onRevertedRevision() {
        this.refs.dashboardHistory.toggle();
        this.props.fetchDashboard(this.props.dashboard.id, this.props.location.query);
    }

    getEditingButtons() {
        return [
            <ActionButton
                key="save"
                actionFn={() => this.onSave()}
                className="Button Button--small Button--primary text-uppercase"
                normalText="保存"
                activeText="保存中…"
                failedText="保存失败"
                successText="已保存"
            />,
            <a data-metabase-event="Dashboard;Cancel Edits" key="cancel" className="Button Button--small text-uppercase" onClick={() => this.onCancel()}>
                取消
            </a>,
            <ModalWithTrigger
                key="delete"
                ref="deleteDashboardModal"
                triggerClasses="Button Button--small text-uppercase"
                triggerElement="删除"
            >
            
                <DeleteDashboardModal
                    dashboard={this.props.dashboard}
                    onClose={() => this.refs.deleteDashboardModal.toggle()}
                    onDelete={() => this.onDelete()}
                />
            </ModalWithTrigger>
        ];
    }

    getHeaderButtons() {
        const { dashboard, parameters, isEditing, isFullscreen, isNightMode } = this.props;
        const isEmpty = !dashboard || dashboard.ordered_cards.length === 0;
        const canEdit = !!dashboard;

        const buttons = [];

        if (isFullscreen && parameters) {
            buttons.push(...parameters);
        }

        if (isEditing) {

            // Parameters
            buttons.push(
                <span>
                    <Tooltip tooltip="添加一个过滤条件">
                        <a
                          key="parameters"
                          className={cx("text-brand-hover", { "text-brand": this.state.modal == "parameters" })}
                          title="参数"
                          onClick={() => this.setState({ modal: "parameters" })}
                        >
                            <Icon name="funneladd" size={16} />
                        </a>
                    </Tooltip>

                    {this.state.modal && this.state.modal === "parameters" &&
                        <Popover onClose={() => this.setState({modal: false})}>
                            <ParametersPopover
                                onAddParameter={this.props.addParameter}
                                onClose={() => this.setState({modal: false})}
                            />
                        </Popover>
                    }
                </span>
            );

            buttons.push(
                <ModalWithTrigger
                    key="history"
                    ref="dashboardHistory"
                    triggerElement={
                        <Tooltip tooltip="修改记录">
                            <span data-metabase-event={"Dashboard;Revisions"}>
                                <Icon className="text-brand-hover" name="history" size={16} />
                            </span>
                        </Tooltip>
                    }
                >
                    <HistoryModal
                        entityType="dashboard"
                        entityId={dashboard.id}
                        revisions={this.props.revisions["dashboard-"+dashboard.id]}
                        onFetchRevisions={this.onFetchRevisions.bind(this)}
                        onRevertToRevision={this.onRevertToRevision.bind(this)}
                        onClose={() => this.refs.dashboardHistory.toggle()}
                        onReverted={() => this.onRevertedRevision()}
                    />
                </ModalWithTrigger>
            );
        }

        if (!isFullscreen && !isEditing && canEdit) {
            buttons.push(
                <Tooltip tooltip="更改仪表盘">
                    <a data-metabase-event="Dashboard;Edit" key="edit" title="仪表盘布局更改" className="text-brand-hover cursor-pointer" onClick={() => this.onEdit()}>
                        <Icon name="pencil" size={16} />
                    </a>
                </Tooltip>
            );
        }

        if (!isFullscreen && canEdit) {
            buttons.push(
                <ModalWithTrigger
                    key="add"
                    ref="addQuestionModal"
                    triggerElement={
                        <Tooltip tooltip="添加图表卡片">
                            <span data-metabase-event="Dashboard;Add Card Modal" title="添加一个图表到当前仪表盘">
                                <Icon className={cx("text-brand-hover cursor-pointer", { "Icon--pulse": isEmpty })} name="add" size={16} />
                            </span>
                        </Tooltip>
                    }
                >
                    <AddToDashSelectQuestionModal
                        dashboard={dashboard}
                        cards={this.props.cards}
                        fetchCards={this.props.fetchCards}
                        addCardToDashboard={this.props.addCardToDashboard}
                        onEditingChange={this.props.onEditingChange}
                        onClose={() => this.refs.addQuestionModal.toggle()}
                    />
                </ModalWithTrigger>
            );
        }

        if (!isEditing && !isEmpty) {
            buttons.push(
                <RefreshWidget data-metabase-event="Dashboard;Refresh Menu Open" className="text-brand-hover" key="refresh" period={this.props.refreshPeriod} elapsed={this.props.refreshElapsed} onChangePeriod={this.props.setRefreshPeriod} />
            );
        }

        if (!isEditing && isFullscreen) {
            buttons.push(
                <Tooltip tooltip={isNightMode ? "常规模式" : "夜晚模式"}>
                    <span data-metabase-event={"Dashboard;Night Mode;"+!isNightMode}>
                        <NightModeIcon className="text-brand-hover cursor-pointer" key="night" isNightMode={isNightMode} onClick={() => this.props.onNightModeChange(!isNightMode) } />
                    </span>
                </Tooltip>
            );
        }

        if (!isEditing && !isEmpty) {
            // option click to enter fullscreen without making the browser go fullscreen
            buttons.push(
                <Tooltip tooltip={isFullscreen ? "退出全屏" : "全屏显示"}>
                    <span data-metabase-event={"Dashboard;Fullscreen Mode;"+!isFullscreen}>
                        <FullscreenIcon className="text-brand-hover cursor-pointer" key="fullscreen" isFullscreen={isFullscreen} onClick={(e) => this.props.onFullscreenChange(!isFullscreen, !e.altKey)} />
                    </span>
                </Tooltip>
            );
        }

        return [buttons];
    }

    render() {
        var { dashboard } = this.props;

        return (
            <Header
                headerClassName="wrapper"
                objectType="dashboard"
                item={dashboard}
                isEditing={this.props.isEditing}
                isEditingInfo={this.props.isEditing}
                headerButtons={this.getHeaderButtons()}
                editingTitle="您正在编辑一个仪表盘"
                editingButtons={this.getEditingButtons()}
                setItemAttributeFn={this.props.setDashboardAttribute}
                headerModalMessage={this.props.isEditingParameter ?
                    "选择一个所有图表共享的过滤条件" : null}
                onHeaderModalDone={() => this.props.setEditingParameterId(null)}
            >
            </Header>
        );
    }
}
