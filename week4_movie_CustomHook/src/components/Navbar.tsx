import { NavLink } from "react-router-dom";

const LINKS = [
  { to: '/', label: '홈' },
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/top_rated', label: '평점 높은' },
  { to: '/movies/upcoming', label: '개봉 예정' },
  { to: '/movies/now_playing', label: '상영 중' },
];

export default function Navbar() {
  return (
    <div className="flex gap-10 p-15">
      {LINKS.map(({ to, label}) => (
        <NavLink
          to={to}
          key={to}
          className={({ isActive }) => {
            return isActive ? 'text=[#b2dab1] font-bold' : 'text-gray-500';
          }}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}