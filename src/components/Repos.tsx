import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

interface ChartData {
  label: string,
  value: number,
  stars: number
}

const Repos = () => {

  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((total, repo) => {
    const { language, stargazers_count } = repo
    if (!language) return total;

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count
      }
    }
    return total;
  }, {} as { [k: string]: ChartData })

  const languageData = Object.values(languages).sort((a, b) => b.value - a.value)
    .map((item) => { return { label: item.label, value: String(item.value) } })
    .slice(0, 5)

  const starData = Object.values(languages).sort((a, b) => b.stars - a.stars)
    .map(item => { return { label: item.label, value: String(item.stars) } })
    .slice(0, 5)

  const { stars, forks } = repos.reduce((total, repo) => {
    const { stargazers_count, name, forks } = repo
    total.stars[stargazers_count] = { label: name, value: stargazers_count }
    total.forks[forks] = { label: name, value: forks }
    return total
  }, {
    stars: {} as { [k: string]: { label: string, value: number } },
    forks: {} as { [k: string]: { label: string, value: number } }
  })

  const starsPerRepo = Object.values(stars)
    .map(item => { return { label: item.label, value: String(item.value) } })
    .slice(-5).reverse()

  const forksPerRepo = Object.values(forks)
    .map(item => { return { label: item.label, value: String(item.value) } })
    .slice(-5).reverse()

  return <section className='section'>
    <Wrapper className='section-center'>
      <Pie3D data={languageData} />
      <Column3D data={starsPerRepo} />
      <Doughnut2D data={starData} />
      <Bar3D data={forksPerRepo} />
    </Wrapper>
  </section>;
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
