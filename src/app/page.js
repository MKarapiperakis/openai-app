import classes from "./page.module.css";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className={classes.main}>
        <header className={classes.header}>
          <div>
            <div className={classes.hero}>
              <h1>Challenge yourself with our AI-powered knowledge tests!</h1>
              <p>Dive into a world of learning with OpenAI by your side</p>
            </div>
            <div className={classes.cta}>
              <Link href="/home" className={classes.cta1}>Learn more about the app</Link>
              <Link href="/quiz">Test your knowledge</Link>
            </div>
          </div>
        </header>
      </main>
    </>
  );
}
