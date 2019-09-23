import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Slide} from '../../models/slide';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit, AfterViewInit {

  @Input() slide: Slide;
  video: any;

  activeSlide: Slide = new Slide();

  width: number;
  constructor(private dataService: DataService) {
    setInterval(() => {
      this.width = window.innerWidth;
      console.log(this.width);
    }, 5000);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataService.activeSlide.subscribe(slide => {
      this.activeSlide = slide;
      if (slide.name === 'Видео') {
        this.playVideo(slide);
        this.video = slide;
      } else {
        this.pauseVideo();
      }
    });
  }

  playVideo(slide) {
    (document.getElementById(slide.object_video[0].url_video) as HTMLVideoElement).currentTime = 0;
    (document.getElementById(slide.object_video[0].url_video) as HTMLVideoElement).play();
  }

  pauseVideo() {
    (document.getElementById(this.video.object_video[0].url_video) as HTMLVideoElement).pause();
  }

}
