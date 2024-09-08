/* eslint-disable no-restricted-syntax */
import { Badge, Tooltip, Button } from 'react-daisyui';
import { AndroidView } from '../models/AndroidView';

function findViewWithId(viewHierarchy: any, id: number): AndroidView | null {
  let foundView = null;
  function recursiveSearch(viewId: number, view: AndroidView) {
    for (let i = 0; i < view.children.length; i += 1) {
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
  console.log(data);
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

const ViewDetails = function viewDetails({ selectedView, viewHierarchy }: any) {
  const view = findViewWithId(viewHierarchy, selectedView) as AndroidView;
  if (!view) {
    return <div>Select a view</div>;
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">
          {view.name}
          {view.properties && view.properties.includes('focused') ? (
            <Tooltip position="bottom" message="keyboard focused">
              <div role="button" tabIndex={0} className="ml-1">
                <div className="badge badge-sm badge-primary">
                  <span aria-hidden="true">focused</span>
                  <span className="sr-only">keyboard focused</span>
                </div>
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {view.properties && view.properties.includes('a11y focused') ? (
            <Tooltip position="bottom" message="accessibility focused">
              <div role="button" tabIndex={0} className="ml-1">
                <div className="badge badge-sm badge-secondary">
                  <span aria-hidden="true">acc focused</span>
                  <span className="sr-only">accessibility focused</span>
                </div>
              </div>
            </Tooltip>
          ) : (
            ''
          )}
        </h1>
      </div>
      <table className="table table-zebra-zebra">
        <caption className="text-base">View Details</caption>
        <thead className="text-accent-content bg-neutral-content">
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>role</td>
            <td>{transformData(view.name)}</td>
          </tr>
          <tr>
            <td>text</td>
            <td>{transformData(view.text)}</td>
          </tr>
          <tr>
            <td>content description</td>
            <td>{transformData(view.content)}</td>
          </tr>
          <tr>
            <td>heading</td>
            <td>{view.heading ? 'true' : 'false'}</td>
          </tr>
          <tr>
            <td>state description</td>
            <td>{transformData(view.state)}</td>
          </tr>
          <tr>
            <td>checked</td>
            <td>{transformData(view.checkable)}</td>
          </tr>
          <tr>
            <td>properties</td>
            <td>{transformData(view.properties)}</td>
          </tr>
          <tr>
            <td>actions</td>
            <td>{transformData(view.actions)}</td>
          </tr>
          <tr>
            <td>collection info</td>
            <td>{transformData(view.collectionInfo)}</td>
          </tr>
          <tr>
            <td>collection item info</td>
            <td>{transformData(view.collectionItemInfo)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewDetails;
