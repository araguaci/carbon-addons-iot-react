import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';
import { SkeletonText } from '../SkeletonText';

import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';

const { iotPrefix } = settings;

export const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
    /** The nodes should be Carbon Tags components */
    tags: PropTypes.arrayOf(PropTypes.node),
  }),
  children: PropTypes.arrayOf(PropTypes.object),
  isSelectable: PropTypes.bool,
};

const propTypes = {
  /** Specify an optional className to be applied to the container */
  className: PropTypes.string,
  /** list title */
  title: PropTypes.string,
  /** search bar call back function and search value */
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  /** action buttons on right side of list title */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  /** use full height in list */
  isFullHeight: PropTypes.bool,
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** icon can be left or right side of list row primary value */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** Currently selected item */
  selectedId: PropTypes.string,
  /** Multiple currently selected items */
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** pagination at the bottom of list */
  pagination: PropTypes.shape(SimplePaginationPropTypes),
  /** ids of row expanded */
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  /** call back function of select */
  handleSelect: PropTypes.func,
  /** call back function of expansion */
  toggleExpansion: PropTypes.func,
};

const defaultProps = {
  className: null,
  title: null,
  search: null,
  buttons: [],
  isFullHeight: false,
  isLargeRow: false,
  isLoading: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
  },
  iconPosition: 'left',
  pagination: null,
  selectedId: null,
  selectedIds: [],
  expandedIds: [],
  handleSelect: () => {},
  toggleExpansion: () => {},
};

const List = forwardRef((props, ref) => {
  // Destructuring this way is needed to retain the propTypes and defaultProps
  const {
    className,
    title,
    search,
    buttons,
    items,
    isFullHeight,
    i18n,
    pagination,
    selectedId,
    selectedIds,
    expandedIds,
    handleSelect,
    toggleExpansion,
    iconPosition,
    isLargeRow,
    isLoading,
  } = props;
  const selectedItemRef = ref;
  const renderItemAndChildren = (item, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId || selectedIds.some(id => item.id === id);
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions, tags },
      isSelectable,
      isCategory,
    } = item;

    return [
      // data-floating-menu-container is a work around for this carbon issue: https://github.com/carbon-design-system/carbon/issues/4755
      <div
        key={`${item.id}-list-item-parent-${level}-${value}`}
        data-floating-menu-container
        className={`${iotPrefix}--list-item-parent`}
      >
        <ListItem
          id={item.id}
          key={`${item.id}-list-item-${level}-${value}`}
          nestingLevel={level}
          value={value}
          icon={icon}
          iconPosition={iconPosition}
          secondaryValue={secondaryValue}
          rowActions={rowActions}
          onSelect={handleSelect}
          onExpand={toggleExpansion}
          selected={isSelected}
          expanded={isExpanded}
          isExpandable={hasChildren}
          isLargeRow={isLargeRow}
          isCategory={isCategory}
          isSelectable={isSelectable}
          i18n={i18n}
          selectedItemRef={isSelected ? selectedItemRef : null}
          tags={tags}
        />
      </div>,

      ...(hasChildren && isExpanded
        ? item.children.map(child => renderItemAndChildren(child, level + 1))
        : []),
    ];
  };

  const listItems = items.map(item => renderItemAndChildren(item, 0));

  return (
    <div
      className={classnames(`${iotPrefix}--list`, className, {
        [`${iotPrefix}--list__full-height`]: isFullHeight,
      })}
    >
      <ListHeader
        className={`${iotPrefix}--list--header`}
        title={title}
        buttons={buttons}
        search={search}
        i18n={i18n}
        isLoading={isLoading}
      />
      <div
        className={classnames(
          {
            // If FullHeight, the content's overflow shouldn't be hidden
            [`${iotPrefix}--list--content__full-height`]: isFullHeight,
          },
          `${iotPrefix}--list--content`
        )}
      >
        {!isLoading ? (
          listItems
        ) : (
          <SkeletonText className={`${iotPrefix}--list--skeleton`} width="90%" />
        )}
      </div>
      {pagination && !isLoading ? (
        <div className={`${iotPrefix}--list--page`}>
          <SimplePagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
});

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
