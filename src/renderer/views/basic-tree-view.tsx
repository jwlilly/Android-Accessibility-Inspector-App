import TreeView, {
  flattenTree,
  ITreeViewOnSelectProps,
} from 'react-accessible-treeview';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

const testData = {
  name: '',
  children: [
    {
      windowId: 18,
      name: 'Window',
      title: 'Developer options',
      children: [
        {
          id: 1441487,
          name: 'ScrollView',
          x1: 0,
          y1: 0,
          x2: 1080,
          y2: 2274,
          actions: ['a11y focus', 'scroll backward'],
          properties: ['scrollable'],
          children: [
            {
              id: 1443409,
              name: 'FrameLayout',
              x1: 0,
              y1: 0,
              x2: 1080,
              y2: 279,
              content: 'Developer options',
              actions: ['a11y focus'],
              children: [
                {
                  id: 1446292,
                  name: 'ImageButton',
                  x1: 0,
                  y1: 132,
                  x2: 147,
                  y2: 279,
                  content: 'Navigate up',
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable', 'focused', 'a11y focused'],
                },
                {
                  id: 1445331,
                  name: 'TextView',
                  visibility: 'invisible',
                  x1: 189,
                  y1: 170,
                  x2: 189,
                  y2: 241,
                  text: 'Developer options',
                  actions: ['a11y focus'],
                },
                {
                  id: 1550080,
                  name: 'Button',
                  x1: 954,
                  y1: 142,
                  x2: 1080,
                  y2: 268,
                  content: 'Search settings',
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                },
              ],
            },
            {
              id: 1449175,
              name: 'LinearLayout',
              x1: 0,
              y1: 279,
              x2: 1080,
              y2: 566,
              actions: ['focus', 'click', 'a11y focus'],
              properties: ['focusable', 'clickable'],
              children: [
                {
                  id: 1452058,
                  name: 'TextView',
                  x1: 116,
                  y1: 384,
                  x2: 785,
                  y2: 461,
                  text: 'Use developer options',
                  actions: ['a11y focus'],
                },
                {
                  id: 1453019,
                  name: 'Switch',
                  x1: 848,
                  y1: 359,
                  x2: 985,
                  y2: 485,
                  state: 'ON (ON)',
                  checkable: 'checked',
                  actions: ['a11y focus'],
                },
              ],
            },
            {
              id: 1460707,
              name: 'RecyclerView',
              x1: 0,
              y1: 566,
              x2: 1080,
              y2: 2274,
              actions: [
                'focus',
                'a11y focus',
                'scroll forward',
                'scroll backward',
              ],
              properties: ['focusable', 'scrollable'],
              collectionInfo: 'Rows: 135, Columns: 1',
              children: [
                {
                  id: 1581793,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 751,
                  x2: 1080,
                  y2: 912,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 20, Column: 0',
                  children: [
                    {
                      id: 1585637,
                      name: 'TextView',
                      x1: 63,
                      y1: 793,
                      x2: 972,
                      y2: 870,
                      text: 'Revoke USB debugging authorizations',
                      actions: ['a11y focus'],
                    },
                  ],
                },
                {
                  id: 1588520,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 912,
                  x2: 1080,
                  y2: 1128,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 21, Column: 0',
                  children: [
                    {
                      id: 1592364,
                      name: 'TextView',
                      x1: 63,
                      y1: 954,
                      x2: 537,
                      y2: 1031,
                      text: 'Wireless debugging',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1593325,
                      name: 'TextView',
                      x1: 63,
                      y1: 1031,
                      x2: 691,
                      y2: 1086,
                      text: 'Debug mode when Wi‑Fi is connected',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1597169,
                      name: 'Switch',
                      x1: 901,
                      y1: 957,
                      x2: 1038,
                      y2: 1083,
                      content: 'Wireless debugging',
                      state: 'ON (ON)',
                      checkable: 'checked',
                      actions: ['click', 'a11y focus'],
                      properties: ['clickable'],
                    },
                  ],
                },
                {
                  id: 1598130,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 1128,
                  x2: 1080,
                  y2: 1551,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 22, Column: 0',
                  children: [
                    {
                      id: 1601974,
                      name: 'TextView',
                      x1: 63,
                      y1: 1170,
                      x2: 859,
                      y2: 1313,
                      text: 'Disable adb authorization timeout',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1602935,
                      name: 'TextView',
                      x1: 63,
                      y1: 1313,
                      x2: 859,
                      y2: 1509,
                      text: 'Disable automatic revocation of adb authorizations for systems that have not reconnected within the default (7 days) or user-configured (minimum 1 day) amount of time.',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1604857,
                      name: 'Switch',
                      x1: 901,
                      y1: 1276,
                      x2: 1038,
                      y2: 1402,
                      state: 'OFF (OFF)',
                      checkable: 'not checked',
                      actions: ['a11y focus'],
                    },
                  ],
                },
                {
                  id: 1605818,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 1551,
                  x2: 1080,
                  y2: 1814,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 23, Column: 0',
                  children: [
                    {
                      id: 1609662,
                      name: 'TextView',
                      x1: 63,
                      y1: 1593,
                      x2: 536,
                      y2: 1670,
                      text: 'Bug report shortcut',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1610623,
                      name: 'TextView',
                      x1: 63,
                      y1: 1670,
                      x2: 859,
                      y2: 1772,
                      text: 'Show a button in the power menu for taking a bug report',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1612545,
                      name: 'Switch',
                      x1: 901,
                      y1: 1619,
                      x2: 1038,
                      y2: 1745,
                      state: 'OFF (OFF)',
                      checkable: 'not checked',
                      actions: ['a11y focus'],
                    },
                  ],
                },
                {
                  id: 1613506,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 1814,
                  x2: 1080,
                  y2: 2171,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 24, Column: 0',
                  children: [
                    {
                      id: 1617350,
                      name: 'TextView',
                      x1: 63,
                      y1: 1856,
                      x2: 803,
                      y2: 1933,
                      text: 'Enable verbose vendor logging',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1618311,
                      name: 'TextView',
                      x1: 63,
                      y1: 1933,
                      x2: 859,
                      y2: 2129,
                      text: 'Include additional device-specific vendor logs in bug reports, which may contain private information, use more battery, and/or use more storage.',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1620233,
                      name: 'Switch',
                      x1: 901,
                      y1: 1929,
                      x2: 1038,
                      y2: 2055,
                      state: 'OFF (OFF)',
                      checkable: 'not checked',
                      actions: ['a11y focus'],
                    },
                  ],
                },
                {
                  id: 1621194,
                  name: 'LinearLayout',
                  x1: 0,
                  y1: 2171,
                  x2: 1080,
                  y2: 2274,
                  actions: ['focus', 'click', 'a11y focus'],
                  properties: ['focusable', 'clickable'],
                  collectionItemInfo: 'Row: 25, Column: 0',
                  children: [
                    {
                      id: 1625038,
                      name: 'TextView',
                      x1: 63,
                      y1: 2213,
                      x2: 823,
                      y2: 2274,
                      text: 'Enable view attribute inspection',
                      actions: ['a11y focus'],
                    },
                    {
                      id: 1627921,
                      name: 'Switch',
                      x1: 901,
                      y1: 2188,
                      x2: 1038,
                      y2: 2274,
                      state: 'OFF (OFF)',
                      checkable: 'not checked',
                      actions: ['a11y focus'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      x1: 0,
      y1: 0,
      x2: 1080,
      y2: 2400,
      id: -2147455792,
    },
  ],
};

function ArrowIcon({ isOpen, ...props }: any) {
  if (isOpen) {
    return <ChevronDownIcon className={props.className} />;
  }
  return <ChevronRightIcon className={props.className} />;
}

// eslint-disable-next-line react/prop-types
const BasicTreeView = function basicTreeView({ tree, onViewSelected }: any) {
  const data = flattenTree(tree);
  const viewSelected = (selectedData: ITreeViewOnSelectProps) => {
    if (selectedData.isSelected) {
      onViewSelected(selectedData);
    }
  };
  return (
    <TreeView
      data={data}
      className="mt-4 tree-view"
      aria-label="View hierarchy"
      clickAction="EXCLUSIVE_SELECT"
      onSelect={viewSelected}
      // eslint-disable-next-line react/no-unstable-nested-components
      nodeRenderer={({
        element,
        getNodeProps,
        isBranch,
        isExpanded,
        isSelected,
      }) => (
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getNodeProps()}
          className={`${!isBranch ? 'ml-1' : ''} pl-[10px]`}
        >
          {isBranch && (
            <ArrowIcon
              isOpen={isExpanded}
              className="inline h-[24px] relative left-[-1px] fill-slate-800"
            />
          )}
          <span className={` btn ${isSelected ? 'btn-outline' : 'btn-ghost'}`}>
            {element.name}
            <span className="sr-only">{isSelected ? 'selected' : ''}</span>
          </span>
        </div>
      )}
    />
  );
};

export { BasicTreeView, testData };
