import Image from "next/image";

// Components
import SignUp from "./SignUp";
import Signin from "./SignIn";
import { Footer } from "./Footer";

export default function LandingPage() {
  return (
    <>
      {/* Banner */}
      <div className="flex items-center gap-x-6 bg-gradient-to-r from-emerald-100 to-emerald-300 py-3 px-6 sm:px-3.5 justify-center mx-4 mt-2 rounded-md">
        <p className="text-sm leading-6 text-emerald-700">
          <a href="#">
            <strong className="font-semibold">We're still building!</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            But we're excited to show you what we've built so far.
            <span aria-hidden="true" className="ml-2">
              &rarr;
            </span>
          </a>
        </p>
      </div>
      {/* Header */}
      <div className="mx-2 bg-white sm:mx-0">
        <header className="flex justify-end p-6 px-10 " aria-label="Global">
          <Signin />
        </header>

        <div className="flex flex-col max-w-xl gap-6 mx-auto mt-20">
          <Image
            width={64}
            height={64}
            src="/logo.png"
            alt="logo"
            className="mx-auto transition-all duration-300 rounded-lg hover:scale-110 "
          />
          <div>
            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-7xl">
              Get in done fast, today,{" "}
              <span className="text-emerald-300 animate-pulse">together</span>.
            </h1>
            <p className="leading-6 text-center text-gray-400 sm:leading-8 sm:text-lg ">
              Multiplater task & scheduling for ambitious async teams.
            </p>
          </div>
          <div className="flex justify-center ">
            <SignUp />
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-16 mb-24 transition-all duration-300 cursor-pointer hover:scale-105">
          <Image
            width={1440}
            height={500}
            src="/Amie.jpeg"
            alt="hero"
            className="rounded-2xl"
          />
        </div>
        <Footer />
      </div>
    </>
  );
}
