import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col w-full h-screen mx-auto my-0 border-4">
      <Outlet />
    </div>
  );
}
