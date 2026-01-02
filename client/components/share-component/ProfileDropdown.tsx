import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { userProfileRoute } from "@/NavBarRoute";
import { Avatar, Dropdown } from "antd";

export default function ProfileDropdown({
  profileImage,
}: {
  profileImage?: string;
}) {
  return (
    <Dropdown
      menu={{ items: userProfileRoute as any }}
      placement="bottomRight"
      trigger={["click"]}
      overlayClassName="pt-2 profile-dropdown-overlay"
    >
      <div className="cursor-pointer group relative">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-global-button-radius 
                           bg-global-button-primary p-0.5 border border-white/20
                           transition-all duration-300 shadow-md hover:shadow-lg 
                           hover:bg-global-button-hover hover:scale-105 overflow-hidden"
        >
          <Avatar
            size={32}
            src={getUploadImageUrl(profileImage)}
            className="transition-transform duration-300"
            style={{
              background:
                "linear-gradient(to bottom right, var(--button-primary-color), var(--button-hover-color))",
            }}
          />
        </div>

        {/* Online Indicator */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                           border-2 border-white rounded-full shadow-sm"
          style={{ backgroundColor: "#10b981" }}
        ></span>

        {/* Tooltip */}
        <span
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 
                           text-[10px] font-medium px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                           pointer-events-none z-50 bg-global-button-primary text-global-button-text shadow-xl"
        >
          My Account
        </span>
      </div>
    </Dropdown>
  );
}
