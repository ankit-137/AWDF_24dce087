import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

function Home() {
  const mySkills = ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML'];

  return (
    <div>
      <Header name="Ankit's Portfolio" themeColor="#63bbf1ff" />
      <About />
      <Skills skillList={mySkills} />
    </div>
  );
}

export default Home;
