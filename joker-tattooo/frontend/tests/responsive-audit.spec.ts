import { test } from '@playwright/test';

const routes = ['/', '/gallery', '/what-we-do', '/contact'];
const viewports = [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1600', width: 1600, height: 1000 },
];

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${viewport.name} ${route}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`http://127.0.0.1:8080${route}`, { waitUntil: 'networkidle' });
      const result = await page.evaluate(() => {
        const root = document.documentElement;
        const overflowing = [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.right > root.clientWidth + 1 || rect.left < -1;
          })
          .slice(0, 12)
          .map((element) => ({ tag: element.tagName, className: element.className, text: element.innerText?.slice(0, 50), rect: element.getBoundingClientRect().toJSON() }));
        const smallTargets = [...document.querySelectorAll<HTMLElement>('a,button,input,select,textarea')]
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
          })
          .slice(0, 12)
          .map((element) => ({ tag: element.tagName, className: element.className, text: element.innerText?.slice(0, 40), width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) }));
        return { horizontalOverflow: root.scrollWidth - root.clientWidth, overflowing, smallTargets };
      });
      console.log(JSON.stringify({ viewport: viewport.name, route, ...result }));
    });
  }
}
