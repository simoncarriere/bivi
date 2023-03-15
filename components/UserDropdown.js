import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
// Hooks
import { useLogout } from "../hooks/useLogout";
// Icons
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDropdown({ user }) {
  const { logout } = useLogout();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <span className="relative inline-block mx-auto transition-all ease-in-out cursor-pointer hover:scale-110 duration-400 ">
            <svg
              className="w-12 h-12 text-gray-300 border border-gray-100 rounded-full"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>

            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
          </span>
        </Menu.Button>
        {/* <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <ChevronDownIcon
            className="w-5 h-5 -mr-1 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button> */}
      </div>

      <div className="absolute bottom-0 w-56 px-2 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg z-100 -right-60 focus:outline-none">
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items>
            <div className="relative px-2 py-3">
              <p className="text-sm">Howdy</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-2 py-2 text-sm"
                    )}
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="https://twitter.com/simonsjournal"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-2 py-2 text-sm"
                    )}
                  >
                    Support
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="https://bivi.notion.site/Bivi-Roadmap-7a4f490a54fe4af7b5cc53a5ed2c802f"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-2 py-2 text-sm"
                    )}
                  >
                    Roadmap
                  </a>
                )}
              </Menu.Item>
            </div>
            <div>
              <form>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      type="text"
                      className="btn-primary"
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </form>
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
}
