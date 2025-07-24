import { Dashboard } from "@arction/lcjs";

export const animateRowHeights = (
    dashboard: Dashboard,
    from: [number, number],
    to: [number, number],
    duration = 1000
  ) => {
    const start = performance.now();

    function animate(time: number) {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1); 
      const ease = t * (2 - t); 

      const h0 = from[0] + (to[0] - from[0]) * ease;
      const h1 = from[1] + (to[1] - from[1]) * ease;

      dashboard.setRowHeight(0, h0);
      dashboard.setRowHeight(1, h1);

      if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
