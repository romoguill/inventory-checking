import OrgMenu from './OrgMenu';

function AppHeader() {
  return (
    <div className='h-16 col-span-1 col-start-2 row-span-1 bg-dashboard-dark flex items-center'>
      <OrgMenu />
    </div>
  );
}

export default AppHeader;
