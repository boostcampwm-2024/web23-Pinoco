import HeaderLogo from '@/assets/images/HeaderLogo.svg?react';
import Bell from '@/assets/images/Bell.svg?react';

export default function LobbyHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <HeaderLogo />
      </div>
      <nav>
        <ul className="flex gap-2">
          <li>
            <Bell />
          </li>
          <li></li>
        </ul>
      </nav>
    </header>
  );
}
