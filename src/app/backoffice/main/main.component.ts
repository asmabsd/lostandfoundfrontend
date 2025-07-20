import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadScripts();
  }

  loadScripts() {
    // Load core JS files
    const scriptElements = [
      { src: 'assets/backoffice/assets/vendor/js/helpers.js' },
      { src: 'assets/backoffice/assets/vendor/js/bootstrap.js' },
      { src: 'assets/backoffice/assets/vendor/js/menu.js' },
      { src: 'assets/backoffice/assets/js/main.js' }
    ];

    scriptElements.forEach(scriptElement => {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptElement.src;
      this.renderer.appendChild(document.body, script);
    });
  }
}