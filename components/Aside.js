import { useState } from "react";
// COMPONENTS
import Chat from "./Chat";
import Todos from "./Todos";
import Events from "./Events";

const tabs = [
  { name: "Tasks", href: "#" },
  { name: "Chat", href: "#" },
  { name: "Events", href: "#" },
];

export default function Aside() {
  // Mamage currentTab state
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <div className="h-full max-h-screen pt-2 pb-5 bg-white ">
      {/* Tabs */}
      <div>
        {/* Mobile tab list */}
        <div className=" sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            // defaultValue={tabs.find((tab) => tab.current).name}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop tab list */}
        <div className="fixed top-0 hidden w-full pt-4 bg-white shadow sm:block">
          <div className="">
            <nav className="flex px-6 space-x-6" aria-label="Tabs">
              {tabs.map((tab) =>
                currentTab === tab ? (
                  <a
                    key={tab.name}
                    href={tab.href}
                    value={tab.name}
                    className="py-2 text-xs font-semibold border-b-2 border-slate-500 text-slate-700 whitespace-nowrap"
                    aria-current={tab.current ? "page" : undefined}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {tab.name}
                  </a>
                ) : (
                  <a
                    key={tab.name}
                    href={tab.href}
                    value={tab.name}
                    className="py-2 text-xs font-medium border-b-2 border-transparent text-slate-400 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap"
                    aria-current={tab.current ? "page" : undefined}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {tab.name}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
      <div className="px-6 mt-12 mb-6 overflow-y-auto ">
        {currentTab.name === "Tasks" && <Todos />}
        {currentTab.name === "Chat" && <Chat />}
        {currentTab.name === "Events" && <Events />}
      </div>
    </div>
  );
}
