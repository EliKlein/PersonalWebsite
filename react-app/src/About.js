import React from 'react';
import { RESUME_DATE } from './config';
import './About.css';

function About() {
  const pdfLink = `Klein_Elias_Resume_${RESUME_DATE}.pdf`;
  const date = RESUME_DATE.replace(/-/g, "/");
  return (
    <div className="About-Main container">
      <h5 className="Content-Related-Head">Resumé:</h5>
      <p>
        See pdf{" "}<a href={pdfLink}>here</a>{" "}(updated {date})
      </p>
      <h5 className="Content-Related-Head">Me as a person:</h5>
      <div className="row">
        <ul className="About-List col-9">
          <li>
            I'm always curious about how things work, or if things work. I
            like to dive into new technologies to find out exactly what makes
            them tick.
          </li>
          <li>
            I accept most things for what they are; because, most of the time
            there's either no reason or no way to change them.
          </li>
          <li>
            I listen to others, and I'm receptive to criticism. Though, I
            remember things best when I express them to others, so I might
            sound like I'm making excuses.
          </li>
          <li>
            I try to be positive and honest. In the rare case that I can't be
            both, I prefer being honest.
          </li>
          <li>
            I have some hobbies...
            <ul className="About-SubList">
              <li>
                Video games, board games, role-playing games, card games, word
                games. Any games.
              </li>
              <li>Baking</li>
              <li>Netflix/etc. - I like anime in particular</li>
              <li>Crossword puzzles</li>
              <li>Piano (I don't improvise)</li>
            </ul>
          </li>
          <li>Also, I've been known to make a lot of puns.</li>
        </ul>
        <div className="col">
          <img className="rounded img-fluid" src="picture-of-me.jpg" alt="me">
          </img>
        </div>
      </div>
    </div>
  )
}

export default About;