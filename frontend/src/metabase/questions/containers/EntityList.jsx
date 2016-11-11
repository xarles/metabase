/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import S from "../components/List.css";

import List from "../components/List.jsx";
import SearchHeader from "../components/SearchHeader.jsx";
import ActionHeader from "../components/ActionHeader.jsx";
import EmptyState from "metabase/components/EmptyState.jsx";
import UndoListing from "./UndoListing.jsx";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import { setSearchText, setItemSelected, setAllSelected, setArchived } from "../questions";
import {
    getSection, getEntityType, getEntityIds,
    getSectionName, getSectionLoading, getSectionError,
    getSearchText,
    getVisibleCount, getSelectedCount, getAllAreSelected, getSectionIsArchive,
    getLabelsWithSelectedState
} from "../selectors";

const mapStateToProps = (state, props) => {
  return {
      sectionId:        getSection(state),
      entityType:       getEntityType(state),
      entityIds:        getEntityIds(state),
      loading:          getSectionLoading(state),
      error:            getSectionError(state),

      searchText:       getSearchText(state),

      name:             getSectionName(state),
      visibleCount:     getVisibleCount(state),
      selectedCount:    getSelectedCount(state),
      allAreSelected:   getAllAreSelected(state),
      sectionIsArchive: getSectionIsArchive(state),

      labels:           getLabelsWithSelectedState(state)
  }
}

const mapDispatchToProps = {
    setItemSelected,
    setAllSelected,
    setSearchText,
    setArchived
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EntityList extends Component {
    static propTypes = {
        style:              PropTypes.object.isRequired,
        sectionId:          PropTypes.string.isRequired,
        name:               PropTypes.string.isRequired,
        loading:            PropTypes.bool.isRequired,
        error:              PropTypes.any,
        entityType:         PropTypes.string.isRequired,
        entityIds:          PropTypes.array.isRequired,
        searchText:         PropTypes.string.isRequired,
        setSearchText:      PropTypes.func.isRequired,
        visibleCount:       PropTypes.number.isRequired,
        selectedCount:      PropTypes.number.isRequired,
        allAreSelected:     PropTypes.bool.isRequired,
        sectionIsArchive:   PropTypes.bool.isRequired,
        labels:             PropTypes.array.isRequired,
        setItemSelected:    PropTypes.func.isRequired,
        setAllSelected:     PropTypes.func.isRequired,
        setArchived:        PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        // Scroll to the top of the list if the section changed
        // A little hacky, something like https://github.com/taion/scroll-behavior might be better
        if (this.props.sectionId !== prevProps.sectionId) {
            ReactDOM.findDOMNode(this).scrollTop = 0;
        }
    }

    emptyState () {
      switch (this.props.name) {
        case '全部图表':
          return {
            icon: 'all',
            message: '没有任何图表.'
          }
        case '最近浏览':
          return {
            icon: 'recents',
            message: '没有任何浏览记录.'
          }
        case '由我创建':
          return {
            icon: 'mine',
            message: '没有任何创建图表'
          }
        case '收藏':
          return {
            icon: 'star',
            message: '没有任何收藏图表.'
          }
        case '最流行':
          return {
            icon: 'popular' ,
            message: 'The most viewed questions across your company will show up here.'
          }
        case '归档':
          return {
            icon: 'archive',
            message: '如果标签不再需要，您可以归档到这里.'
          }
        default:
          return {
            icon: 'label',
            message: '没有符合当前标签的图表.'
          }
      }
    }

    render() {
        const {
            style,
            name, loading, error,
            entityType, entityIds,
            searchText, setSearchText,
            visibleCount, selectedCount, allAreSelected, sectionIsArchive, labels,
            setItemSelected, setAllSelected, setArchived
        } = this.props;
        const empty = this.emptyState();
        return (
            <div style={style} className="full">
                  <div className="wrapper wrapper--trim">
                    <div className={S.header}>
                        {name}
                    </div>
                  </div>
                  <LoadingAndErrorWrapper loading={!error && loading} error={error}>
                  { () =>
                        entityIds.length > 0 ? (
                          <div className="wrapper wrapper--trim">
                            <div className="flex align-center my1" style={{height: 40}}>
                              { selectedCount > 0 ?
                                <ActionHeader
                                  visibleCount={visibleCount}
                                  selectedCount={selectedCount}
                                  allAreSelected={allAreSelected}
                                  sectionIsArchive={sectionIsArchive}
                                  setAllSelected={setAllSelected}
                                  setArchived={setArchived}
                                  labels={labels}
                                  />
                                :
                                <SearchHeader searchText={searchText} setSearchText={setSearchText} />
                              }
                            </div>
                            <List entityType={entityType} entityIds={entityIds} setItemSelected={setItemSelected} />
                          </div>
                        ) : (
                          <div className={S.empty}>
                            <EmptyState message={empty.message} icon={empty.icon} />
                          </div>
                        )
                  }
                  </LoadingAndErrorWrapper>
                <UndoListing />

            </div>
        );
    }
}
