import HeaderLogo from '@/assets/images/HeaderLogo.svg?react';
import Bell from '@/assets/images/Bell.svg?react';
import Friends from '@/assets/images/Friends.svg?react';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="ml-8">
        <HeaderLogo />
      </div>
      <nav>
        <ul className="flex gap-4 last:mr-8">
          <li>
            <Bell />
          </li>
          <li>
            <Friends />
          </li>
        </ul>
      </nav>
    </header>
  );
}
