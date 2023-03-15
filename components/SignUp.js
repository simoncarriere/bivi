"use client";
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
// Hooks
import { useSignup } from "../hooks/useSignup";

const SignUp = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { signup, error, loading } = useSignup();
  // Input Ref
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName);
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="px-6 py-4 text-base font-semibold tracking-wide border rounded-md shadow-sm cursor-pointer text-slate-700 border-slate-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Skip the waitlist
      </div>
      {showModal && (
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={emailRef}
            onClose={() => setShowModal(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-800"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-800/60" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-800"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-500"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-2 p-6"
                    >
                      <Dialog.Title as="h1" className="mb-4">
                        Hey stranger! Let's get aquainted.
                      </Dialog.Title>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                        required
                        ref={emailRef}
                      />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="What can we call you?"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                        required
                      />
                      {loading ? (
                        <button className="btn-disabled" type="disabled">
                          Loading...
                        </button>
                      ) : (
                        <button className="btn-primary" type="submit">
                          Sign Up
                        </button>
                      )}
                      {error && <p className="text-red-400">{error}</p>}
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};
export default SignUp;
