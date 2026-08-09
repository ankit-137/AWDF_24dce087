import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

function Home() {
  const mySkills = ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML'];

  return (
    <div>
      <Header name="Student Portfolio" themeColor="#6366f1" />
      <About />
      <Skills skillList={mySkills} />
    </div>
  );
}

export default Home;
