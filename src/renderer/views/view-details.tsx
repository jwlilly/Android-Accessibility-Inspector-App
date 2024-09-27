/* eslint-disable no-restricted-syntax */
import { Tooltip } from 'react-daisyui';
import { useEffect, useState } from 'react';
import { AndroidView } from '../models/AndroidView';

function findViewWithId(viewHierarchy: any, id: number): AndroidView | null {
  let foundView = null;
  function recursiveSearch(viewId: number, view: AndroidView) {
    for (let i = 0; view.children && i < view.children.length; i += 1) {
      const item = view.children[i];
      if (item.id && item.id === viewId) {
        foundView = item;
        return;
      }
      if (item.children && item.children.length > 0) {
        recursiveSearch(viewId, item);
      }
    }
  }
  recursiveSearch(id, viewHierarchy);
  if (foundView) {
    return foundView;
  }
  return null;
}

function transformData(data: any) {
  if (!data) {
    return '-';
  }
  if (data instanceof Array) {
    return data.join(', ').replaceAll('a11y focus', 'accessibility focus');
  }
  if (data === 'not checked') {
    return 'false';
  }
  if (data === 'checked') {
    return 'true';
  }
  return data;
}

const ViewDetails = function ViewDetails({ selectedView, viewHierarchy }: any) {
  const view = findViewWithId(viewHierarchy, selectedView) as AndroidView;
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const webViewEl = document.querySelector(`[id="${selectedView}-webview"]`);
    if (webViewEl && webViewEl.checkVisibility()) {
      setIsWebView(true);
    } else {
      setIsWebView(false);
    }
  }, [selectedView, isWebView]);
  if (!view) {
    return <div>Select a view</div>;
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">
          <div className="text-center">{view.name}</div>
          <div className="flex flex-row justify-center">
            {view.metadata.properties &&
            view.metadata.properties.includes('focused') ? (
              <Tooltip position="bottom" message="keyboard focused">
                <div role="button" tabIndex={0} className="ml-1">
                  <div className="block badge badge-sm badge-primary">
                    <span aria-hidden="true">focused</span>
                    <span className="sr-only">keyboard focused</span>
                  </div>
                </div>
              </Tooltip>
            ) : (
              ''
            )}
            {view.metadata.properties &&
            view.metadata.properties.includes('accessibility focused') ? (
              <Tooltip position="bottom" message="accessibility focused">
                <div role="button" tabIndex={0} className="ml-1">
                  <div className="block badge badge-sm badge-secondary">
                    <span aria-hidden="true">acc focused</span>
                    <span className="sr-only">accessibility focused</span>
                  </div>
                </div>
              </Tooltip>
            ) : (
              ''
            )}
            {isWebView && (
              <div className="block badge badge-sm badge-success ml-1">
                <span>WebView</span>
              </div>
            )}
          </div>
        </h1>
      </div>
      <table className="table mx-2 table-zebra-zebra max-w-[calc(100%-1rem)]">
        <caption className="text-base">View Details</caption>
        <thead className="text-primary-content bg-primary">
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>role</td>
            <td className="font-mono">{transformData(view.metadata.role)}</td>
          </tr>
          <tr>
            <td>role description</td>
            <td className="font-mono">
              {transformData(view.metadata.roleDescription)}
            </td>
          </tr>
          <tr>
            <td>text</td>
            <td className="font-mono">{transformData(view.metadata.text)}</td>
          </tr>
          <tr>
            <td>content description</td>
            <td className="font-mono">
              {transformData(view.metadata.content)}
            </td>
          </tr>
          <tr>
            <td>heading</td>
            <td className="font-mono">
              {view.metadata.heading ? 'true' : 'false'}
            </td>
          </tr>
          <tr>
            <td>state</td>
            <td className="font-mono">{transformData(view.metadata.state)}</td>
          </tr>
          <tr>
            <td>state description</td>
            <td className="font-mono">
              {transformData(view.metadata.stateDescription)}
            </td>
          </tr>
          <tr>
            <td>tooltip</td>
            <td className="font-mono">
              {transformData(view.metadata.tooltip)}
            </td>
          </tr>
          <tr>
            <td>checked</td>
            <td className="font-mono">
              {transformData(view.metadata.checkable)}
            </td>
          </tr>
          <tr>
            <td>content invalid</td>
            <td className="font-mono">
              {transformData(view.metadata.contentInvalid)}
            </td>
          </tr>
          <tr>
            <td>error message</td>
            <td className="font-mono">
              {transformData(view.metadata.errorMessage)}
            </td>
          </tr>
          <tr>
            <td>properties</td>
            <td className="font-mono">
              {transformData(view.metadata.properties)}
            </td>
          </tr>
          <tr>
            <td>actions</td>
            <td className="font-mono">
              {transformData(view.metadata.actions)}
            </td>
          </tr>
          <tr>
            <td>links</td>
            <td className="font-mono">{transformData(view.metadata.links)}</td>
          </tr>
          <tr>
            <td>locales</td>
            <td className="font-mono">
              {transformData(view.metadata.locales)}
            </td>
          </tr>
          <tr>
            <td>collection info</td>
            <td className="font-mono">
              {transformData(view.metadata.collectionInfo)}
            </td>
          </tr>
          <tr>
            <td>collection item info</td>
            <td className="font-mono">
              {transformData(view.metadata.collectionItemInfo)}
            </td>
          </tr>
          <tr>
            <td>visibility</td>
            <td className="font-mono">
              {transformData(view.metadata.visibility)}
            </td>
          </tr>
          <tr>
            <td>important for accessibility</td>
            <td className="font-mono">
              {!view.metadata.importantForAccessibility ? 'false' : 'true'}
            </td>
          </tr>
          <tr>
            <td>actual size</td>
            <td className="font-mono">{`${Number(view.metadata.x2) - Number(view.metadata.x1)} px x ${Number(view.metadata.y2) - Number(view.metadata.y1)} px`}</td>
          </tr>
          <tr>
            <td>scaled size</td>
            <td className="font-mono">
              {`${view.metadata.scaledWidth} dp x ${view.metadata.scaledHeight} dp`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewDetails;
