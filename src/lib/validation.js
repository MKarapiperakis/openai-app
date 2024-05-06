export default function validation(...formData) {
  const acceptedTechnologies = [
    "JavaScript",
    "HTML",
    "CSS",
    "SQL",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "Swift",
  ];
  const acceptedDifficulties = ["Beginner", "Advanced", "Expert"];
  const acceptedTypes = ["Quiz", "Code"];

  const technology = formData[0];
  const difficulty = formData[1];
  const type = formData[2];
  const questions = formData[3];


  if (
    type == "Code" &&
    acceptedTechnologies.includes(technology) &&
    acceptedDifficulties.includes(difficulty) &&
    acceptedTypes.includes(type)
  ) {
    return true;
  } else if (
    type == "Quiz" &&
    questions > 0 &&
    questions <= 10 &&
    acceptedTechnologies.includes(technology) &&
    acceptedDifficulties.includes(difficulty) &&
    acceptedTypes.includes(type)
  ){
    return true;
  }
    return false;
}
