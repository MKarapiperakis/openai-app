import classes from "./score.module.css";
export default function Score(params) {
  return (
    <>
      {params.score <= 40 && (
        <p>
          <span className={classes.bad}>Not so good!</span>
          <br></br>
          <span className={classes.highlight} style={{ marginLeft: "10px" }}>
            Score: {params.score}/100
          </span>
        </p>
      )}
      {params.score > 40 && params.score <= 80 && (
        <p>
          <span className={classes.good}>Very good!</span>
          <br></br>
          <span className={classes.highlight}>Score: {params.score}/100</span>
        </p>
      )}
      {params.score > 80 && (
        <p>
          <span className={classes.excelent} style={{ marginLeft: "27px" }}>
            Excellent!
          </span>
          <br></br>
          <span className={classes.highlight}>Score: {params.score}/100</span>
        </p>
      )}
    </>
  );
}
