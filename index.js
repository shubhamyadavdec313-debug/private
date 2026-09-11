import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const START_DATE = moment("2026-01-01");
const END_DATE = moment("2026-09-12");

const makeCommits = async () => {
  let current = START_DATE.clone();
  let total = 0;

  console.log("Creating ~250 commits...\n");

  while (current.isSameOrBefore(END_DATE)) {
    // Only ~40% of days will have commits
    if (random.float() < 0.40) {
      // Almost always 1 commit, rarely 2
      const commitsToday = random.float() < 0.85 ? 1 : 2;

      for (let i = 0; i < commitsToday; i++) {
        const date = current
          .clone()
          .hour(random.int(10, 19))
          .minute(random.int(0, 59))
          .second(random.int(0, 59))
          .format();

        const data = { date };
        console.log(date);

        await jsonfile.writeFile(path, data);
        await git.add([path]);
        await git.commit(date, { "--date": date });

        total++;
        await new Promise(r => setTimeout(r, 40));
      }
    }

    current.add(1, "day");
  }

  console.log(`\nTotal commits created: ${total}`);
  console.log("Pushing...");
  await git.push();
  console.log("✅ Done!");
};

makeCommits();