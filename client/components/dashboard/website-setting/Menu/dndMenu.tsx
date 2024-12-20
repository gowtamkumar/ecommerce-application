// import { useState } from "react";
// import dynamic from "next/dynamic";
// import { Button, Input } from "antd";

// const MenuBuilder = dynamic(() => import("react-dnd-menu-builder"), {
//   ssr: false,
// });

// function DNDMenu() {
//   const [menus, setMenus] = useState(initialMenus);
//   const [formData, setFormData] = useState(initialFormData);

//   const addMenu = () => {
//     setMenus([
//       ...menus,
//       {
//         ...formData,
//         id: Math.random().toString(36).substring(7),
//       },
//     ]);
//     setFormData({ id: "", name: "", href: "", children: [] });
//   };

//   return (
//     <div className="flex flex-col">
//       <div>
//         <Button
//           onClick={() => {
//             addMenu();
//           }}
//         >
//           Add Menu
//         </Button>
//         <Input
//           placeholder="Home"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         />
//         <Input
//           placeholder="/home"
//           value={formData.href}
//           onChange={(e) => setFormData({ ...formData, href: e.target.value })}
//         />
//       </div>

//       <MenuBuilder items={menus} setItems={setMenus} style="bordered" />
//     </div>
//   );
// }

// export default DNDMenu;

// const initialMenus = [
//   {
//     id: "Home",
//     name: "Home",
//     href: "/home",
//     children: [],
//   },
//   {
//     id: "Collections",
//     href: "/collections",
//     name: "Collections",
//     children: [
//       {
//         id: "Spring",
//         name: "Spring",
//         href: "/spring",
//         children: [],
//       },
//     ],
//   },
// ];

// const initialFormData = {
//   id: "",
//   name: "",
//   href: "",
//   children: [],
// };
