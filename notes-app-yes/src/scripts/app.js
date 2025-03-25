import './components/index.js';
import { home } from './view/main.js';
import '../styles/style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Daftarkan ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  home();

  // Aktifkan smooth scrolling dengan CSS (alternatif ScrollSmoother)
  document.documentElement.style.scrollBehavior = 'smooth';

  // Tambahkan animasi saat scroll untuk elemen dengan class .content
  gsap.utils.toArray('section').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 50%', // Mulai saat elemen mendekati viewport
        toggleActions: 'play none none reverse',
      },
    });
  });
});
