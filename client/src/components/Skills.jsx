function Skills({ skillList }) {
  return (
    <section className="card">
      <h2>My Skills</h2>
      <div className="skills-grid">
        {skillList.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Skills;
