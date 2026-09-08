import {HouseIcon, PackageIcon, TagIcon, UsersThreeIcon} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

export default function NavbarAdmin() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-stone-600 hover:bg-orange-50 hover:text-orange-600"
    }`;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-70 flex-col border-r border-zinc-200 bg-white px-4 py-5">
      <div className="mb-7 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
          <PackageIcon size={24} weight="regular" color="white" />
        </div>

        <div>
          <h1 className="text-[16px] font-extrabold tracking-tight text-zinc-800">
            BOMbocado
          </h1>

          <p className="mt-0.5 text-[9px] font-bold tracking-[0.08em] text-stone-500">
            ADMINISTRADOR
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        <NavLink to="/admin" end className={linkClass}>
          <HouseIcon size={20} weight="regular" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/produtos" className={linkClass}>
          <PackageIcon size={20} weight="regular" />
          <span>Produtos</span>
        </NavLink>

        <NavLink to="/admin/categorias" className={linkClass}>
          <TagIcon size={20} weight="regular" />
          <span>Categorias</span>
        </NavLink>

        <NavLink to="/admin/clientes" className={linkClass}>
      <UsersThreeIcon size={20} weight="regular" />
      <span>Clientes</span>
    </NavLink>
  </nav>


  <div className="mt-auto border-t border-zinc-100 pt-4 text-center">
    <img className="w-30 p-2 mx-auto" src="./content.png" alt="" />
     <p className="text-xs font-medium text-stone-400">
      Bombocado Delivery de Alimentos
    </p>
    <p className="text-xs font-medium text-stone-400">
      Copyright © Ignis Code Solutions | 2026
    </p>
  </div>
    </aside>
  );
}