export interface AndroidView {
    id?: number;
    resourceId?: string;
    windowId?: number;
    role?: string;
    title?:string;
    hint?:string;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    text?: string;
    heading?: boolean;
    content?: string;
    labeledBy?: string;
    labeledById?: number;
    actions?: string[];
    state?: string;
    properties?: string[];
    children: AndroidView[];
    collectionInfo?:String;
    collectionItemInfo?:String;
    paneTitle?:String;
    checkable?:String;
    links?: string[];
    visibility?: string;
    importantForAccessibility?: boolean;
}
