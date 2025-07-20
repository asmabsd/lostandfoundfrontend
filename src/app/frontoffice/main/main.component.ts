import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.loadStyles();
    this.loadScripts();
  }

  private loadStyles(): void {
    // Bootstrap CSS
    this.addStylesheetLink('assets/travelix/styles/bootstrap4/bootstrap.min.css');
    
    // Font Awesome
    this.addStylesheetLink('assets/travelix/plugins/font-awesome-4.7.0/css/font-awesome.min.css');
    
    // Owl Carousel CSS
    this.addStylesheetLink('assets/travelix/plugins/OwlCarousel2-2.2.1/owl.carousel.css');
    this.addStylesheetLink('assets/travelix/plugins/OwlCarousel2-2.2.1/owl.theme.default.css');
    this.addStylesheetLink('assets/travelix/plugins/OwlCarousel2-2.2.1/animate.css');
    
    // Main styles
    this.addStylesheetLink('assets/travelix/styles/main_styles.css');
    this.addStylesheetLink('assets/travelix/styles/responsive.css');
  }

  private loadScripts(): void {
    // jQuery
    this.addScript('assets/travelix/js/jquery-3.2.1.min.js', true);
    
    // Bootstrap JS
    this.addScript('assets/travelix/styles/bootstrap4/popper.js', false);
    this.addScript('assets/travelix/styles/bootstrap4/bootstrap.min.js', false);
    
    // Owl Carousel
    this.addScript('assets/travelix/plugins/OwlCarousel2-2.2.1/owl.carousel.js', false);
    this.addScript('assets/travelix/plugins/easing/easing.js', false);
    
    // Custom JS
    this.addScript('assets/travelix/js/custom.js', false);
  }

  private addStylesheetLink(href: string): void {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'type', 'text/css');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(this.document.head, link);
  }

  private addScript(src: string, isAsync: boolean = false): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    if (isAsync) {
      script.async = true;
    }
    this.renderer.appendChild(this.document.body, script);
  }
}