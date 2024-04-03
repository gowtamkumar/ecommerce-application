"use client";
import { Avatar, Button, Dropdown, Input, Select } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { userProfileRoute } from "@/NavBarRoute";

const Header: React.FC = () => {
  const session = useSession();

  const { Option } = Select;
  const { Search } = Input;

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

  return (
    <>
      <div className="flex justify-between items-center gap-5">
        <div className="flex gap-5">
          <small>Help & Support</small>
          <small>
            {" "}
            <Link href="/about">About</Link>
          </small>
        </div>
        <div>
          <Button type="primary" size="small">
            <Link href="/">Donwload App</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center py-4">
        <div className="w-1/6 text-center">
          <Link href="/">
            <Image
              width={300}
              height={300}
              className="mx-auto h-10 w-auto"
              src="/pos_software.png"
              alt="Your Company"
            />
          </Link>
        </div>

        <div className="w-4/6">
          <Search
            addonBefore={selectBefore}
            width={100}
            size="middle"
            defaultValue="mysite"
          />
        </div>

        <div className="w-1/6 flex justify-between items-center">
          <div className="ml-3">
            <Link href="/checkout">
              <FaShoppingCart size={20} />
            </Link>
          </div>

          {session.status === "authenticated" ? (
            <Dropdown
              menu={{ items: userProfileRoute as any }}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Avatar
                className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
                size={35}
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              />
            </Dropdown>
          ) : (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center justify-between">
                <FaRegUser />{" "}
                <Link className="mx-2" href="/login">
                  Login
                </Link>{" "}
                |{" "}
                <Link className="mx-2" href="/register">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
