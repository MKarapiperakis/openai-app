import classes from "./page.module.css";
export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.hero}>
          <h1>Welcome to OPENAI CODEMASTER</h1>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          
          <p className={classes.label}>
          OPENAI CODEMASTER is a revolutionary platform that utilizes OpenAI services to generate engaging quizzes and code challenges. The aim of this app is to offer users a dynamic and interactive platform for testing and broadening their knowledge across a diverse array of subjects..
          </p>
          <p className={classes.label}>
            Whether you're a beginner looking to learn new concepts or an expert seeking to sharpen your skills, our app offers a wide range of challenges tailored to your interests and expertise level. With our user-friendly interface and innovative content generation, you'll embark on a learning journey that's both enjoyable and rewarding.
          </p>
          <p className={classes.label}>
            Join us today and unlock your potential! Let's explore the fascinating world of learning together.
          </p>
        </section>
      </main>
    </>
  );
}