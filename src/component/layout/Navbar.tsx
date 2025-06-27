interface NavbarProps {
  title?: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Utazon</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Projets</a>
          </li>
          <li>
            <a>à propos</a>
          </li>
          <li>
            <a>Me contacter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
