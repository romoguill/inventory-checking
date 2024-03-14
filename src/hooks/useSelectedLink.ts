import { sidebarLinks } from '@/app/(protected)/_components/sidebar/Sidebar';
import { usePathname } from 'next/navigation';

const useSelectedLink = () => {
  const pathname = usePathname();

  const activeLinks = [];

  sidebarLinks.forEach((link) => {
    if (link.type === 'link' && link.href === pathname) {
      activeLinks.push(link);
    }

    let parent;
    if (link.type === 'menu') {
      parent = link;
      link.children.forEach((link) => {
        if (link.type === 'link' && link.href === pathname) {
          activeLinks.push();
        }
      });
    }
  });
};
