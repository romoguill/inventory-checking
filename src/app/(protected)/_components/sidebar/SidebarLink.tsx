import { TSidebarLink } from './Sidebar';

interface SidebarLinkProps {
  link: TSidebarLink;
}

function SidebarLink({ link }: SidebarLinkProps) {
  return (
    <li className='bg-dashboard-accent rounded-sm text-dashboard-dark font-semibold pl-4 py-2 pr-2 flex gap-2 items-center'>
      <link.Icon />
      <span>{link.label}</span>
    </li>
  );
}

export default SidebarLink;
