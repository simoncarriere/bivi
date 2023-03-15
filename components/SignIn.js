"use client";
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
// Hooks
import { useSignin } from "../hooks/useSignin";

const Signin = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, login } = useSignin();
  // Input Ref
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
      >
        Log in <span aria-hidden="true">&rarr;</span>
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
              <div className="flex items-end justify-center min-h-full p-4 text-center md:items-center sm:p-0">
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
                        Welcome back captain!
                      </Dialog.Title>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef}
                      />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {loading ? (
                        <button className="btn-disable" type="disabled">
                          Loading...
                        </button>
                      ) : (
                        <button className="btn-primary" type="submit">
                          Login
                        </button>
                      )}
                      <p>Forgot your password? It happens.</p>
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
export default Signin;
