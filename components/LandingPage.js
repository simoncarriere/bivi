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
            <strong className="font-semibold">
              We&apos;re still building!
            </strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            But we&apos;re excited to show you what we&apos;ve built so far.
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

        <div className="flex flex-col max-w-xl gap-6 mx-auto mt-20 rounded-lg">
          <Image
            width={64}
            height={64}
            src="/logo.png"
            alt="logo"
            className="object-contain mx-auto transition-all duration-300 rounded-lg hover:scale-110 "
          />
          <div>
            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-7xl">
              Get in done fast, today,{" "}
              <span className="text-emerald-300 animate-pulse">together</span>.
            </h1>
            <p className="leading-6 text-center text-gray-400 sm:leading-8 sm:text-lg ">
              Supercharge your team&apos;s productivity with Bivi. Schedule
              meetings, assign tasks, and keep track of conversations in
              real-time.
              {/* Supercharge your team's productivity with Bivi – the all-in-one
              tool for small ambitious teams. Schedule meetings, assign tasks,
              and keep track of conversations in real-time. */}
              {/* Supercharge your team with Bivi – Schedule meetings, assign tasks,
              and keep track of conversations in real-time. */}
              {/* Sign up now and start collaborating more efficiently! */}
              {/* Bivi is the perfect companion for small ambitious team to schedule
              and organize all your meetings, tasks and conversation in real
              time */}
              {/* Multiplater task & scheduling for ambitious async teams. */}
            </p>
          </div>
          <div className="flex justify-center ">
            <SignUp />
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-16 mb-24 transition-all duration-300 cursor-pointer hover:scale-105">
          <Image
            width={1440}
            height={986}
            src="/bivi-screenshot-light-2.png"
            // src="/Amie.jpeg"
            alt="hero"
            className="rounded-md "
          />
        </div>
        <Footer />
      </div>
    </>
  );
}
