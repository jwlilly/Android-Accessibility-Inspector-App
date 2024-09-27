/* eslint-disable no-use-before-define */
interface ViewMetadata {
  resourceId?: string;
  windowId?: number;
  role?: string;
  roleDescription?: string;
  name?: string;
  title?: string;
  hint?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  scaledWidth: Number;
  scaledHeight: Number;
  text?: string;
  heading?: boolean;
  content?: string;
  labeledBy?: string;
  labeledById?: number;
  actions?: string[];
  state?: string;
  stateDescription?: string;
  properties?: string[];
  children: AndroidView[];
  collectionInfo?: String;
  collectionItemInfo?: String;
  paneTitle?: String;
  checkable?: String;
  links?: string[];
  locales?: string[];
  visibility?: string;
  importantForAccessibility?: boolean;
  tooltip?: string;
  contentInvalid?: boolean;
  errorMessage?: string;
}
export interface AndroidView {
  name: string;
  id?: number;
  metadata: ViewMetadata;
  children: AndroidView[];
}
