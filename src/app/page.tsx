"use client";

import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

async function sendRequest(url: string, { arg }: { arg: { email: string } }) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function Home() {
  const emailRef = useRef<HTMLInputElement>();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // repalce with your own endpoint url
  const { trigger } = useSWRMutation(
    "https://s8tv8ve9wu.us.aircode.run/subscribe",
    sendRequest /* options */
  );

  const onSubscribe = async (_e: React.FormEvent<HTMLFormElement>) => {
    _e.preventDefault();
    if (!email && emailRef.current) {
      emailRef.current.focus();
      setMessage("Please fill out email field.");
      return;
    }
    try {
      const result = (await trigger({ email } /* options */)) as {
        message: string;
        code: number;
      };

      const { message, code } = result;
      if (message) {
        setMessage(result?.message);
      }

      if (code === 0) {
        setEmail("");
      }
    } catch (error) {
      const e = error as { message: string };
      let message = "An error has occurred. ";
      if (e && "message" in e) {
        message += `error message: ${e.message}. `;
      }
      message += "please try again later.";
      setMessage(message);
    }
  };

  const onChange = (email: string): void => {
    setEmail(email);
    if (message) {
      setMessage("");
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
            <div className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl lg:col-span-7">
              <p className="inline sm:block lg:inline xl:block">
                Want product news and updates?
              </p>{" "}
              <p className="inline sm:block lg:inline xl:block">
                Sign up for our newsletter.
              </p>
            </div>
            <form
              className="w-full max-w-md lg:col-span-5 lg:pt-2"
              onSubmit={onSubscribe}
            >
              <div className="flex gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-neutral-100/5 px-3.5 py-2 text-neutral-100 shadow-sm ring-1 ring-inset ring-neutral-100/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => onChange(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Subscribe
                </button>
              </div>
              <div className="mt-2.5 leading-6">
                {
                  <span className="text-[13px] block text-[#8a8f98] font-medium">
                    {message}
                  </span>
                }
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-300">
                We care about your data. Read our{" "}
                <a
                  href="https://docs.aircode.io/legal/privacy-policy"
                  className="font-semibold text-neutral-100"
                >
                  Privacy&nbsp;Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
