import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy, ApplicationRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AndroidView } from './AndroidView';
import { ElectronService } from 'ngx-electron';
import { BoundingBox } from './BoundingBox';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Android Accessibility Inspector';
  jsonData: AndroidView = this.createEmptyView();
  boundingBoxArray:Array<BoundingBox> = [];
  fileContent: string = '';
  imageBase64:string = '';
  fileLocation: string = 'assets/output.txt';
  imageSizeW = 0;
  imageSizeH = 0;
  a11yMessage:string = "";
  webSocket: WebSocketSubject<any> = webSocket('ws://localhost:38301/');
  connected = true;
  waitingForResponse = false;
  clickView: AndroidView = this.createEmptyView();
  hoverView: AndroidView = this.createEmptyView();
  focusView: AndroidView = this.createEmptyView();
  loading = false;
  pingJson:JSON = JSON.parse('{"message":"ping"}');
  captureJson:JSON = JSON.parse('{"message":"capture"}');
  importantJson:JSON = JSON.parse('{"message":"toggleImportant"}');
  outlineDimensions = {
    'width' : '0px',
    'height' : '0px',
    'left' : '-1px',
    'top' : '-1px',
    'position' : 'absolute',
    'outline' : 'red',
    'outline-style' : 'solid',
    'display': 'none'
  };
  hoverOutlineDimensions = {
    'width' : '0px',
    'height' : '0px',
    'left' : '-1px',
    'top' : '-1px',
    'position' : 'absolute',
    'outline' : '#63C23B',
    'outline-style' : 'dotted',
    'display' : 'none'
  };

  focusOutlineDimensions = {
    'width' : '0px',
    'height' : '0px',
    'left' : '-1px',
    'top' : '-1px',
    'position' : 'absolute',
    'outline' : 'magenta',
    'outline-style' : 'dashed',
    'display' : 'none',
    'outline-offset' : '-4px'
  };
  rerender = false;
  @Input() recursiveList: any;
  commandError: (event: any, data: any) => void;
  successMessage: (event: any, data: any) => void;
  infoMessage: (event: any, data: any) => void;
  updateImage: (event: any, data: any) => void;
  reconnect: (event: any, data: any) => void;
  retryConnection: (event: any, data: any) => void;
  showImportantViews: (event: any, data: any) => void;

  constructor(private http: HttpClient, private _electronService: ElectronService, private cdRef: ChangeDetectorRef, private toastr: ToastrService, private appRef: ApplicationRef){
    this.reconnect = (event, data) => {
      this.connectSocket();
    };
    this.commandError = (event, data) => {
      this.showErrorToast(data.error);
    };
    this.successMessage = (event, data) => {
      this.showSuccessToast(data.message);
    };

    this.infoMessage = (event, data) => {
      this.showInfoToast(data.message);
    };

    this.updateImage = (event, data) => {
      this.imageBase64 = "data:image/png;base64," + data;

      setTimeout(() => {
        this.doRerender();
      }, 150);
    };
    this.retryConnection = (event, data) => {
      this.refreshConnection();
    };
    this.showImportantViews = (event, data) => {
      this.showNotImportantViews();
    };
  }

  doRerender() {
    this.rerender = true;
    //this.cdRef.detectChanges();
    this.appRef.tick();
    this.rerender = false;
  }

  ngOnInit() {
    this._electronService.ipcRenderer.send('forwardPorts');
    this._electronService.ipcRenderer.send('finishSetup');
    this._electronService.ipcRenderer.on("commandError", this.commandError);
    this._electronService.ipcRenderer.on("successMessage", this.successMessage);
    this._electronService.ipcRenderer.on("infoMessage", this.infoMessage);
    this._electronService.ipcRenderer.on("updateImage", this.updateImage);
    this._electronService.ipcRenderer.on("reconnect", this.reconnect);
    this._electronService.ipcRenderer.on("refreshConnection", this.retryConnection);
    this._electronService.ipcRenderer.on("showImportantViews", this.showImportantViews);
    this.connectSocket();
  }

  ngOnDestroy() {
    this.webSocket.unsubscribe();
    this.webSocket.complete();
  }

  sendPing() {
    if(this.connected) {
      this.webSocket.next(this.pingJson);
      this.waitingForResponse = true;
      console.log("ping --->");
      setTimeout(() => {
        this.sendPing();
      }, 30000);
    }
  }

  createEmptyView() : AndroidView{
    const emptyView = (): AndroidView => ({
      id: 0,
      role: '',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      children: Array<AndroidView>()
  });
    return emptyView();
  }
  startSetup() {
    this.focusView = this.createEmptyView();
    this.showFocusBorder(this.focusView);
    if(this._electronService.isElectronApp && this.connected){
      this.webSocket.next(this.captureJson);
      window.scrollTo(0, 0);
      this.waitingForResponse = true;
      setTimeout(() => {
        if(this.waitingForResponse) {
          this.connected = false;
          this.doRerender();
        }
      }, 5000);
    }

  }
  connectSocket() {
    setTimeout(() => {
      this.sendPing();
    }, 5000);
    console.log('connecting');
    this._electronService.ipcRenderer.send('finishSetup');
    this.loading = false;
    this.webSocket.subscribe(
      msg => {
        this.connected = true;
        this.waitingForResponse = false;
        if(msg.views) {
          if(msg.screenshot) {
            this.imageBase64 = "data:image/png;base64," + msg.screenshot;
            if(msg.showNotImportant) {
              this._electronService.ipcRenderer.send('setNotImportant', msg.showNotImportant);
            }
            this.jsonData = msg.views as AndroidView;
          }

          this.collectBoundingBoxes();
          this.clickView = this.createEmptyView();
          this.hoverView = this.createEmptyView();
          this.showClickBorder(this.clickView);
          this.showHoverBorder(this.hoverView);
          this.announceForAccessibility('content loaded');
          this.doRerender();
        } else {
          if(msg.message) {
            console.log("<--- " + msg.message);
          }
          if(msg.announcement) {
            this.showInfoToast("announceForAccessibilty(): " + msg.announcement);
          }
        }
      },
      err => {
        console.log(err);
        this.webSocket.complete();
        this.connected = false;
        this.announceForAccessibility('connection unsuccessful');
        this.doRerender();
      },
      () => {
        this.connected = false;
        this.doRerender();
      }
   );
  }
  refreshConnection() {
    if(!this.loading) {
      this.announceForAccessibility('Retrying. Please wait...');
      this.loading = true;
      console.log("restarting server");
      this._electronService.ipcRenderer.send('restartServer');
    }
  }

  nodeClicked(event: Event, view:AndroidView) {
    this.clickView = view;
    let element:Element = event.currentTarget as Element;
    let listItem = element.parentElement!;
    document.querySelectorAll('li.active').forEach((item) => {
      item.classList.remove('active');
      item.querySelectorAll('button[aria-pressed="true"]').forEach((child) => {
        child.setAttribute('aria-pressed', 'false');
        child.classList.remove('btn-active');
      });
    });
    this.showClickBorder(view);
    listItem.classList.add('active');
    element.setAttribute('aria-pressed', 'true');
    element.classList.add('btn-active');
    this.doRerender();
    event.stopPropagation();
    return false;
  }

  labeledByClicked(event: Event, view:AndroidView) {
    if(view.labeledById) {
      let element = document.getElementById(String(view.labeledById));
      if(element) {
        element.focus();
        element.click();
      }

    }
    event.stopPropagation();
    return false;
  }

  showClickBorder(view:AndroidView) {
    let margin = 5;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    if(view.x1) {
      x1 = view.x1;
    }
    if(view.y1) {
      y1 = view.y1;
    }
    if(view.x2) {
      x2 = view.x2;
    }
    if(view.y2) {
      y2 = view.y2;
    }
    let image = document.getElementById('screenshot') as HTMLImageElement;
    let imageW = Number(image?.naturalWidth);
    let imageH = Number(image?.naturalHeight);
    let currentWidth:number = Number(document.getElementById('screenshot')?.offsetWidth);
    let currentHeight:number = Number(document.getElementById('screenshot')?.offsetHeight);
    let natrualX1:number = Number(((currentWidth / imageW) * x1).toFixed(0));
    let natrualX2:number = Number(((currentWidth / imageW) * x2).toFixed(0));
    let natrualY1:number = Number(((currentHeight / imageH) * y1).toFixed(0));
    let natrualY2:number = Number(((currentHeight / imageH) * y2).toFixed(0));
    let width = (natrualX2 - natrualX1);
    let height = (natrualY2 - natrualY1);
    let left = natrualX1 + margin;
    let top = natrualY1 + margin
    this.outlineDimensions.width = width + 'px';
    this.outlineDimensions.height = height + 'px';
    this.outlineDimensions.left = left + 'px';
    this.outlineDimensions.top = top + 'px';
    if(height === 0 && width === 0){
      this.outlineDimensions.display = 'none';
    }
    else {
      this.outlineDimensions.display = 'block';
    }
  }

  showHoverBorder(view:AndroidView) {
    let margin = 5;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    if(view.x1) {
      x1 = view.x1;
    }
    if(view.y1) {
      y1 = view.y1;
    }
    if(view.x2) {
      x2 = view.x2;
    }
    if(view.y2) {
      y2 = view.y2;
    }
    let image = document.getElementById('screenshot') as HTMLImageElement;
    let imageW = Number(image?.naturalWidth);
    let imageH = Number(image?.naturalHeight);
    let currentWidth:number = Number(document.getElementById('screenshot')?.offsetWidth);
    let currentHeight:number = Number(document.getElementById('screenshot')?.offsetHeight);
    let natrualX1:number = Number(((currentWidth / imageW) * x1).toFixed(0));
    let natrualX2:number = Number(((currentWidth / imageW) * x2).toFixed(0));
    let natrualY1:number = Number(((currentHeight / imageH) * y1).toFixed(0));
    let natrualY2:number = Number(((currentHeight / imageH) * y2).toFixed(0));
    let width = (natrualX2 - natrualX1);
    let height = (natrualY2 - natrualY1);
    let left = natrualX1 + margin;
    let top = natrualY1 + margin
    this.hoverOutlineDimensions.width = width + 'px';
    this.hoverOutlineDimensions.height = height + 'px';
    this.hoverOutlineDimensions.left = left + 'px';
    this.hoverOutlineDimensions.top = top + 'px';
    if(height === 0 && width === 0){
      this.hoverOutlineDimensions.display = 'none';
    }
    else {
      this.hoverOutlineDimensions.display = 'block';
    }
  }

  showFocusBorder(view:AndroidView) {
    let margin = 5;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    if(view.x1) {
      x1 = view.x1;
    }
    if(view.y1) {
      y1 = view.y1;
    }
    if(view.x2) {
      x2 = view.x2;
    }
    if(view.y2) {
      y2 = view.y2;
    }
    let image = document.getElementById('screenshot') as HTMLImageElement;
    let imageW = Number(image?.naturalWidth);
    let imageH = Number(image?.naturalHeight);
    let currentWidth:number = Number(document.getElementById('screenshot')?.offsetWidth);
    let currentHeight:number = Number(document.getElementById('screenshot')?.offsetHeight);
    let natrualX1:number = Number(((currentWidth / imageW) * x1).toFixed(0));
    let natrualX2:number = Number(((currentWidth / imageW) * x2).toFixed(0));
    let natrualY1:number = Number(((currentHeight / imageH) * y1).toFixed(0));
    let natrualY2:number = Number(((currentHeight / imageH) * y2).toFixed(0));
    let width = (natrualX2 - natrualX1);
    let height = (natrualY2 - natrualY1);
    let left = natrualX1 + margin;
    let top = natrualY1 + margin
    this.focusOutlineDimensions.width = width + 'px';
    this.focusOutlineDimensions.height = height + 'px';
    this.focusOutlineDimensions.left = left + 'px';
    this.focusOutlineDimensions.top = top + 'px';
    if(height === 0 && width === 0){
      this.focusOutlineDimensions.display = 'none';
    }
    else {
      this.focusOutlineDimensions.display = 'block';
    }
  }

  mouseOver(event:MouseEvent) {
    let view = null;
    let x = event.clientX - 17;
    let y = event.clientY - 5;
    for(let i = 0; i < this.boundingBoxArray.length; i++) {
      let item = this.boundingBoxArray[i];
      if(this.isInBoundingBox(x, y, item.view)) {
        if(view) {
          let x1 = 0;
          let y1 = 0;
          let x2 = 0;
          let y2 = 0;
          if(view.x1) {
            x1 = view.x1;
          }
          if(view.y1) {
            y1 = view.y1;
          }
          if(view.x2) {
            x2 = view.x2;
          }
          if(view.y2) {
            y2 = view.y2;
          }
          let viewWidth = x2 - x1;
          let viewHeight = y2 - y1;

          let itemX1 = 0;
          let itemX2 = 0;
          let itemY1 = 0;
          let itemY2 = 0;
          if(item.view.x1) {
            itemX1 = item.view.x1;
          }
          if(item.view.y1) {
            itemY1 = item.view.y1;
          }
          if(item.view.x2) {
            itemX2 = item.view.x2;
          }
          if(item.view.y2) {
            itemY2 = item.view.y2;
          }

          let itemWidth = itemX2 - itemX1;
          let itemHeight = itemY2 - itemY1;

          if(itemWidth < viewWidth || itemHeight < viewHeight) {
            view = item.view;
          }

        }
        else {
          view = item.view;
        }
      }
    }
    if(view) {
      this.hoverView = view;
      this.showHoverBorder(view);
      this.doRerender();
    }
  }

  onResize(event:Event) {
    this.showClickBorder(this.clickView);
    this.showHoverBorder(this.hoverView);
    this.showFocusBorder(this.focusView);
  }

  imageClick(event:MouseEvent) {
    let x = event.clientX - 17;
    let y = event.clientY - 5;

    let view = null;

    for(let i = 0; i < this.boundingBoxArray.length; i++) {
      let item = this.boundingBoxArray[i];
      if(this.isInBoundingBox(x, y, item.view)) {
        if(view) {
          let x1 = 0;
          let y1 = 0;
          let x2 = 0;
          let y2 = 0;
          if(view.x1) {
            x1 = view.x1;
          }
          if(view.y1) {
            y1 = view.y1;
          }
          if(view.x2) {
            x2 = view.x2;
          }
          if(view.y2) {
            y2 = view.y2;
          }
          let viewWidth = x2 - x1;
          let viewHeight = y2 - y1;

          let itemX1 = 0;
          let itemX2 = 0;
          let itemY1 = 0;
          let itemY2 = 0;
          if(item.view.x1) {
            itemX1 = item.view.x1;
          }
          if(item.view.y1) {
            itemY1 = item.view.y1;
          }
          if(item.view.x2) {
            itemX2 = item.view.x2;
          }
          if(item.view.y2) {
            itemY2 = item.view.y2;
          }

          let itemWidth = itemX2 - itemX1;
          let itemHeight = itemY2 - itemY1;

          if(itemWidth < viewWidth || itemHeight < viewHeight) {
            view = item.view;
          }

        }
        else {
          view = item.view;
        }
      }
    }
    if(view && view.id) {
      this.clickView = view;
      let element:HTMLElement = document.getElementById(view.id.toString()) as HTMLElement;
      let listItem = element.parentElement!;
      document.querySelectorAll('li.active').forEach((item) => {
        item.classList.remove('active');
        item.querySelectorAll('button[aria-pressed="true"]').forEach((child) => {
          child.setAttribute('aria-pressed', 'false');
          child.classList.remove('btn-active');
        });
      });

      listItem.classList.add('active');
      element.setAttribute('aria-pressed', 'true');
      element.focus();
      element.classList.add('btn-active');
      this.showClickBorder(view);
      this.doRerender();
      event.stopPropagation();
    }
    return false;
  }

  isInBoundingBox(x:number, y:number, view: AndroidView):boolean{
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    if(view.x1) {
      x1 = view.x1;
    }
    if(view.y1) {
      y1 = view.y1;
    }
    if(view.x2) {
      x2 = view.x2;
    }
    if(view.y2) {
      y2 = view.y2;
    }

    let image = document.getElementById('screenshot') as HTMLImageElement;
    let imageW = Number(image?.naturalWidth);
    let imageH = Number(image?.naturalHeight);
    let currentWidth:number = Number(document.getElementById('screenshot')?.offsetWidth);
    let currentHeight:number = Number(document.getElementById('screenshot')?.offsetHeight);
    let natrualX1:number = Number(((currentWidth / imageW) * x1).toFixed(0));
    let natrualX2:number = Number(((currentWidth / imageW) * x2).toFixed(0));
    let natrualY1:number = Number(((currentHeight / imageH) * y1).toFixed(0));
    let natrualY2:number = Number(((currentHeight / imageH) * y2).toFixed(0));
    if(natrualX1 <= x && x <= natrualX2 && natrualY1 <= y && y <= natrualY2 ) {
      return true;
    }
    return false;
  }

  collectBoundingBoxes() {
    this.boundingBoxArray = [];
    this.collectBoundingBoxesRecursive(this.jsonData);
  }

  collectBoundingBoxesRecursive(view: AndroidView) {
    for (let i = 0; i < view.children.length; i++) {
      let item = view.children[i];
      if(item.properties && item.properties.indexOf("focused") >= 0) {
        this.showFocusBorder(item);
        this.focusView = item;
      }
      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;
      if(view.x1) {
        x1 = view.x1;
      }
      if(view.y1) {
        y1 = view.y1;
      }
      if(view.x2) {
        x2 = view.x2;
      }
      if(view.y2) {
        y2 = view.y2;
      }

      let box:BoundingBox = {
        view: item,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      }
      this.boundingBoxArray.push(box);
      if(item.children && item.children.length > 0) {
        this.collectBoundingBoxesRecursive(item);
      }
    }
  }
  findViewWithId(id: number): AndroidView {
    let foundView = undefined;
    function recursiveSearch(id: number, view: AndroidView) {
      for(let i = 0; i < view.children.length; i++) {
        let item = view.children[i];
        if(item.id && item.id === id) {
          foundView = item;
          return;
        }
        else if(item.children && item.children.length > 0) {
          recursiveSearch(id, item);
        }
      }
    }
    recursiveSearch(id, this.jsonData);
    if(foundView) {
      return foundView;
    }
    return this.createEmptyView();
  }

  showSuccessToast(message:string) {
    this.toastr.success(message);
    this.doRerender();
    this.announceForAccessibility(message);
  }

  showInfoToast(message:string) {
    console.log(message);
    this.toastr.info(message);
    this.doRerender();
    this.announceForAccessibility(message);
  }
  showErrorToast(message:string) {
    this.toastr.error(message, "Error", {
      'timeOut' : 10000,
      'positionClass' : 'toast-top-right'
    });
    this.doRerender();
    this.announceForAccessibility(message);
  }

  announceForAccessibility(message:string) {
    this.a11yMessage = message;
    this.doRerender();
    setTimeout(() => {
      this.a11yMessage = "";
      this.doRerender();
    }, 1000);
  }

  showNotImportantViews() {
    if(this.connected) {
      this.webSocket.next(this.importantJson);
    }
  }
}
