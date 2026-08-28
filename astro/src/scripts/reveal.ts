const zones = Array.from(document.querySelectorAll<HTMLElement>('.ltsuan-reveal'));
if (zones.length) {
  zones[0].classList.add('is-revealed');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );
  zones.slice(1).forEach((zone) => observer.observe(zone));
}
