import {
  useAddress,
  useConnectionStatus,
  useDisconnect,
  useEmbeddedWallet,
  useWallet,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const connectedWallet = useWallet("embeddedWallet");
  const [email, setEmail] = useState<string | undefined>();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (connectedWallet) {
      connectedWallet?.getEmail().then((email) => setEmail(email));
    }
  }, [connectedWallet]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.column}>
            <h1 className={styles.title}>
              Welcome to{" "}
              <span className={styles.gradientText0}>
                <a
                  href="https://thirdweb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  thirdweb.
                </a>
              </span>
            </h1>
            {address ? (
              <>
                <h3>Connected as {email}</h3>
                <p>Your wallet: {address}</p>
                <button className={styles.button} onClick={disconnect}>
                  Log out
                </button>
              </>
            ) : (
              <>
                {connectionStatus == "disconnected" ? (
                  <>
                    <CustomLogin />
                  </>
                ) : (
                  <div className={styles.spinner} />
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.grid}></div>
      </div>
    </main>
  );
};

// Handles login with Google
const CustomGoogleSignInButton = () => {
  const { connect } = useEmbeddedWallet();

  const signInWithGoogle = async () => {
    await connect({
      strategy: "google",
    });
  };

  return (
    <button className={styles.button} onClick={signInWithGoogle}>
      <svg
        className=" h-5 w-5 mr-2"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
      Sign in with Google
    </button>
  );
};

// Handles login with email
const CustomLogin = () => {
  const [state, setState] = useState<
    "init" | "emter_email" | "sending_email" | "email_verification"
  >("init");

  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const { connect, sendVerificationEmail } = useEmbeddedWallet();

  const handleEmailClicked = async () => {
    setState("emter_email");
  };

  const handleEmailEntered = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    setState("sending_email");
    await sendVerificationEmail({ email });
    setState("email_verification");
  };

  const handleEmailVerification = async () => {
    if (!email || !verificationCode) {
      alert("Please enter an verification code");
      return;
    }
    await connect({ strategy: "email_verification", email, verificationCode });
  };

  if (state === "emter_email") {
    return (
      <>
        <p>Enter your email</p>
        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.button} onClick={handleEmailEntered}>
          Continue
        </button>
        <a onClick={() => setState("init")}>
          <p>Go Back</p>
        </a>
      </>
    );
  }

  if (state === "sending_email") {
    return <div className={styles.spinner} />;
  }

  if (state === "email_verification") {
    return (
      <>
        <p>Enter the verification code sent to your email</p>
        <input
          className={styles.input}
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className={styles.button} onClick={handleEmailVerification}>
          Verify
        </button>
        <a onClick={() => setState("init")}>
          <p>Go Back</p>
        </a>
      </>
    );
  }

  return (
    <>
      <CustomGoogleSignInButton />
      <button className={styles.button} onClick={handleEmailClicked}>
        <svg
          className=" h-5 w-5 mr-2"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Sign in with Email
      </button>
    </>
  );
};

export default Home;
