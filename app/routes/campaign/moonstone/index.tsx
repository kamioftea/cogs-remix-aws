import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="right-aside">
      <div className="content">
        <p className="lead">
          Starting January 2025 Chesterfield Open Gaming Society will be running
          a Moonstone gaming evening and escalation campaign on the 2nd Monday
          of each month.
        </p>
        <p>
          Participants will pick a faction and a starting roster of models that
          will grow as the campaign progresses. We will gradually introduce
          Moonstone campaign mechanics such as upgrades and machination points
          later in the campaign.
        </p>
        <p>
          From February onwards, Moonstones collected will be recorded as
          victory points and used to rank players in the campaign. Once campaign
          cards and machination points are introduced in April, these will
          affect victory points earned as per the Arising campaign rules.
        </p>
        <h2>Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Roster size</th>
              <th>Game size</th>
              <th style={{ width: "50%" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>13th January</td>
              <td>3</td>
              <td>3</td>
              <td>Friendly games</td>
            </tr>
            <tr>
              <td>10th February</td>
              <td>4</td>
              <td>4</td>
              <td>Faction and starting roster locked in</td>
            </tr>
            <tr>
              <td>10th March</td>
              <td>5</td>
              <td>5</td>
              <td>One model in your roster gets an upgrade card</td>
            </tr>
            <tr>
              <td>14th April</td>
              <td>6</td>
              <td>5</td>
              <td>
                From now on, players get campaign cards and two machinations as
                per the Arising campaign rules.
              </td>
            </tr>
            <tr>
              <td>12th May</td>
              <td>7</td>
              <td>6*</td>
              <td>A second model in your roster gets an upgrade card</td>
            </tr>
            <tr>
              <td>9th June</td>
              <td>8</td>
              <td>6*</td>
              <td>Final, game pairings will be based on standings</td>
            </tr>
          </tbody>
        </table>
        <h3>Notes</h3>
        <p>
          The game size increasing to 6 in May and June will be reviewed based
          on how long March's and April's games take to play.
        </p>
        <p>
          Where the roster is larger than the game size, you pick the models to
          use as you deploy them, as per Moonstone organised play rules.
        </p>
        <p>
          As well as adding one new model each month, you may optionally swap an
          existing model in your roster for another each month.
        </p>
        <p>
          As the campaign progresses we will start introducing the campaign
          cards as noted on the table. You can download a PDF of current cards
          from the{" "}
          <a href="https://www.moonstonethegame.com/downloads">
            Moonstone downloads page
          </a>
          .
        </p>
        <p>
          You can follow the{" "}
          <a href="https://www.facebook.com/events/620020453712316/620021343712227">
            Facebook event
          </a>{" "}
          for updates.
        </p>
        <p>
          We will decide in June if the campaign will be continued, or a new one
          started for July onwards.
        </p>
        <p>
          Games will be drawn randomly for all months, except the final in June.
          You will not be randomly paired with someone you have played before,
          but you may end up playing someone you've previously played in the
          final.
        </p>
        <p>
          Most kills, then least deaths are used as tie-breakers for players who
          have collected the same number of moonstones. A model is scored as a
          kill/death if it is slain at least once. Models that are summoned do
          not count for kill/death scores. Models that are resurrected only
          count the first time they are slain. If a model dies due to friendly
          damage (e.g. a catastrophy) it counts as a death, but not a kill.
        </p>
        <h2>Taking part</h2>
        <p>
          If you want to take part, please see Jeff in person at a club night,
          or email:{" "}
          <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>. Please
          include your name, chosen faction, and starting roster. As January is
          for friendly games, the rosters can be submitted any time before 6pm
          on Sunday 9th February.
        </p>
        <p>
          We want this campaign to be accessible as possible. Whilst you are
          encouraged to use the official Moonstone models, this is by no means
          required. You can use proxies or standees as long as it is clear to
          your opponent which model is which. Please make sure you also bring
          the relevant stat cards for the models in your roster, along with any
          upgrade and campaign cards. These can be downloaded from{" "}
          <a href="https://www.moonstonethegame.com/downloads">
            the Moonstone downloads page
          </a>{" "}
          or there is a{" "}
          <a href="https://app.moontome.com/Compendium">
            card compendium app, Moontome
          </a>
          . If you will struggle to print these, please let me know and I we can
          print them and bring them along to the campaign evening.
        </p>
        <p>
          A number of club members also have spare models they are not using in
          the campaign. Please ask on the campaigns facebook events if there are
          models you would be interested in borrowing.
        </p>
        <h2 id="machination">Machination</h2>
        <p>
          From April onwards players will get campaign cards each game and
          opportunities to support or sabotage two other players, other than
          their opponent that week.
        </p>
        <p>
          You start with a base of two campaign cards. If you receive support
          you get three cards, if you are sabotaged you get one. If multiple
          people support you, earn an extra machination point for each support
          after the first.
        </p>
        <p>
          You select your campaign cards for the game before the roll to decide
          who is the early bird. Each campaign card may only be played in one
          game by each player in the entire campaign. You can reselect a card if
          you elected not to play it when previously selected.
        </p>
        <p>
          After the games have been completed you will earn machination points
          based the results of the games you machinated. Top- and bottom-tier
          are the two places at the top and bottom of the the standings, all
          others are middle-tier.
        </p>
        <table>
          <thead>
            <tr>
              <th>Support</th>
              <th>They win</th>
              <th>They lose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Top-tier</th>
              <td>
                <small>
                  <i>You gain</i>
                </small>{" "}
                1 MP
              </td>
              <td>
                <small>
                  <i>You lose</i>
                </small>{" "}
                -2 MP
              </td>
            </tr>
            <tr>
              <th>Middle-tier</th>
              <td>
                <small>
                  <i>You gain</i>
                </small>{" "}
                1 MP
              </td>
              <td>
                <small>
                  <i>You lose</i>
                </small>{" "}
                -1 MP
              </td>
            </tr>
            <tr>
              <th>Bottom-tier</th>
              <td>
                <small>
                  <i>You gain</i>
                </small>{" "}
                1 MP
              </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Sabotage</th>
              <th>They win</th>
              <th>They lose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Top-tier</th>
              <td>-</td>
              <td>
                <small>
                  <i>You gain</i>
                </small>{" "}
                1 MP
              </td>
            </tr>
            <tr>
              <th>Middle-tier</th>
              <td>
                <small>
                  <i>You lose</i>
                </small>{" "}
                -1 MP
              </td>
              <td>
                <small>
                  <i>You gain</i>
                </small>{" "}
                1 MP
              </td>
            </tr>
            <tr>
              <th>Bottom-tier</th>
              <td>
                <small>
                  <i>You lose</i>
                </small>{" "}
                -1 MP
              </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <p>
          Machination points are added to number of moonstones collected to give
          your total score in the campaign.
        </p>
        <p>
          To facilitate machinations, roster changes should be submitted 1 week
          before the next campaign evening, e.g for April, by Monday 7th April.
          Then, any machinations should be submitted the night before the
          campaign evening, e.g. by midnight 13th April. If machinations are not
          submitted, it will be assumed you decided not to intervene in any
          games.
        </p>
      </div>
      <aside className="summary-box">
        <h2>Campaign details</h2>
        <p>
          <Link to="./players">Players</Link>
        </p>
        <p>
          <Link to="./games/february">February Games</Link>
        </p>
        <p>
          <Link to="./games/march">March Games</Link>
        </p>
        <p>
          <Link to="./games/april">April Games</Link>
        </p>
        <p>
          <Link to="./games/may">May Games</Link>
        </p>
        <p>
          <Link to="./games/june">June Games</Link>
        </p>
      </aside>
    </div>
  );
}
