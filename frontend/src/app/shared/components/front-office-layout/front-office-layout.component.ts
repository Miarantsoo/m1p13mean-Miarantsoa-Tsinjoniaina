import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-front-office-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './front-office-layout.component.html',
  styleUrl: './front-office-layout.component.scss'
})
export class FrontOfficeLayoutComponent implements OnInit, OnDestroy {
  currentTime = '0:00';
  currentYear = new Date().getFullYear();

  menuOpen = false;

  navLinks = [
    {label: 'Accueil', path: '/front-office'},
    {label: 'Boutiques et restaurants', path: '/front-office/index'}
  ];

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:scroll')
  onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}
