import React, { Component, PropTypes } from "react";
import styles from "./RefreshWidget.css";

import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import Tooltip from "metabase/components/Tooltip.jsx";
import Icon from "metabase/components/Icon.jsx";
import ClockIcon from "metabase/components/icons/ClockIcon.jsx";
import CountdownIcon from "metabase/components/icons/CountdownIcon.jsx";

import cx from "classnames";

const OPTIONS = [
    { name: "关闭",        period:    null },
    { name: "1 分钟",   period:  1 * 60 },
    { name: "5 分钟",  period:  5 * 60 },
    { name: "10 分钟", period: 10 * 60 },
    { name: "15 分钟", period: 15 * 60 },
    { name: "30 分钟", period: 30 * 60 },
    { name: "60 分钟", period: 60 * 60 }
];

export default class RefreshWidget extends Component {
    render() {
        const { period, elapsed, onChangePeriod, className } = this.props;
        const remaining = period - elapsed;
        return (
            <PopoverWithTrigger
                ref="popover"
                triggerElement={elapsed == null ?
                    <Tooltip tooltip="自动刷新">
                        <ClockIcon width={18} height={18} className={className} />
                    </Tooltip>
                :
                    <Tooltip tooltip={"刷新频率： " + Math.floor(remaining / 60) + ":" + (remaining % 60 < 10 ? "0" : "") + Math.round(remaining % 60)}>
                        <CountdownIcon width={18} height={18} className="text-green" percent={Math.min(0.95, (period - elapsed) / period)}/>
                    </Tooltip>
                }
                targetOffsetY={10}
            >
                <div className={styles.popover}>
                    <div className={styles.title}>自动刷新</div>
                    <RefreshOptionList>
                        { OPTIONS.map(option =>
                            <RefreshOption key={option.period} name={option.name} period={option.period} selected={option.period === period} onClick={() => { this.refs.popover.close(); onChangePeriod(option.period) }} />
                        ) }
                    </RefreshOptionList>
                </div>
            </PopoverWithTrigger>
        );
    }
}

const RefreshOptionList = ({ children }) =>
    <ul>{children}</ul>

const RefreshOption = ({ name, period, selected, onClick }) =>
    <li className={cx(styles.option, styles[period == null ? "off" : "on"], { [styles.selected]: selected })} onClick={onClick}>
        <Icon name="check" size={14} />
        <span className={styles.name}>{ name.split(" ")[0] }</span>
        <span className={styles.nameSuffix}> { name.split(" ")[1] }</span>
    </li>
