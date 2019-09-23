import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {Slide} from './models/slide';
import {ElectronService} from './services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('prev') prev: ElementRef;
  @ViewChild('next') next: ElementRef;

  listSlide: Slide[] = [];

  address: string = '192.168.252.224';

  timeoutSlide: any;
  intervalUpdate: any;
  quantityCheck: number;
  temperature: string;

  constructor(private dataService: DataService, private electronService: ElectronService) {
  }

  ngOnInit() {
    // this.electronService.getIpAddress()
    //   .then(response => {
    //     console.log(response);
    //     this.address = response['eth0'][0].address;
    //
    //     this.getListSlide();
    //     this.checkUpdate();
    //     this.updateData();
    //     this.getTemp();
    //   })
    //   .catch();
    //
    // document.body.style.zoom = '75%';

        this.getListSlide();
        this.checkUpdate();
        this.updateData();
        this.getTemp();
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutSlide);
    this.intervalUpdate.unsubscribe();
  }

  getListSlide() {
    this.dataService.getListSlide(this.address).subscribe(res => {
      clearTimeout(this.timeoutSlide);

      this.listSlide = res;
      this.setInterval(res[0]);

      this.quantityCheck = 1;

      setTimeout(() => {
        this.dataService.setActiveSlide(res[0]);
      }, 100);
    });
  }

  setInterval(slide: Slide) {
    this.dataService.setActiveSlide(slide);

    this.timeoutSlide = setTimeout(() => {

      let index: number;
      index = this.listSlide.indexOf(slide);

      if (this.listSlide.length === (index + 1)) {
        this.setInterval(this.listSlide[0]);
        this.quantityCheck++;
      } else {
        this.setInterval(this.listSlide[index + 1]);
      }

      if (slide.limit === this.quantityCheck) {
        this.listSlide.splice(this.listSlide.indexOf(slide), 1);
      }

      this.next.nativeElement.click();
    }, slide.time_show * 1000);
  }

  checkUpdate() {
    this.intervalUpdate = this.dataService.checkUpdate(this.address).subscribe(res => {
      if (res.fl_update === 1) {
        this.getListSlide();
        this.updateData();
      } else {
        this.updateData();
      }
    });
  }

  updateData() {
    this.dataService.updateMonitor({
      ip_adr: this.address,
      fl_update: 0,
      temperature: this.temperature
    }).subscribe(res => {
      console.log(res);
    });
  }

  getTemp() {
    setInterval(() => {
      this.electronService.getTemp()
        .then(response => {
          console.log(response);
          this.temperature = response.toString().replace('temp=', '');
        })
        .catch();
    }, 10000);
  }
}
