import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="right-aside">
      <div className="content">
        <p className="lead">
          Starting 16th February 2026 Chesterfield Open Gaming Society will be running
          a Moonstone gaming evening and campaign every four weeks.
        </p>
        <p>
          Participants will pick a faction and a starting roster of eight models,
          playing with five of those each game. You can swap out one model each month,
          and upgrade cards will be slowly accrued as the campaign progresses.
        </p>
        <p>
          Moonstones collected will be recorded as
          victory points and used to rank players in the campaign. For the
          first game there will be no machinations and each player can pick
          two campaign cards for their match. From March onwards, match-ups will
          be posted a week in advance, and machinations should be submitted the
          night before the campaign evening.
        </p>
        <h2>Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th style={{ width: "50%" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>16th February</td>
              <td>No machinations</td>
            </tr>
            <tr>
              <td>16th March</td>
              <td>One character gains an upgrade card</td>
            </tr>
            <tr>
              <td>13th April</td>
              <td></td>
            </tr>
            <tr>
              <td>11th May</td>
              <td></td>
            </tr>
            <tr>
              <td>8th June</td>
              <td>A second model in your roster gets an upgrade card</td>
            </tr>
            <tr>
              <td>6th July</td>
              <td>Final game, match-ups based on current standings</td>
            </tr>
          </tbody>
        </table>
        <p>
          You can follow the{" "}
          <a href="https://www.facebook.com/events/620020453712316/620021343712227">
            Facebook event
          </a>{" "}
          for updates.
        </p>
        <p>
          Games will be drawn randomly for all months, except the final in July.
          You will not be randomly paired with someone you have played before,
          but you may end up playing someone you've previously played in the
          final.
        </p>
        <h2>Taking part</h2>
        <p>
          If you want to take part, please see Jeff in person at a club night,
          or email:{" "}
          <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>. Please
          include your name, chosen faction, and starting roster.
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
          Players will get campaign cards each game. From March onwards, each
          player can support or sabotage two other players, other than
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
          who is the early bird. Each campaign card may only be played once in
          the campaign by each player. You can reselect a card if
          you elected not to play it when previously selected.
        </p>
        <p>
          After the games have been completed you will earn machination points
          based the results of the games you machinated. Top- and bottom-tier
          are the two places at the top and bottom of the the standings, all
          others are middle-tier. Where tied players are in different tiers,
          the tied players are all considered to be in the middle tier.
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
          before the next campaign evening, e.g for March, by Monday 2nd March.
          Then, any machinations should be submitted the night before the
          campaign evening, e.g. by midnight 8th Merch. If machinations are not
          submitted, it will be assumed you decided not to intervene in any
          games.
        </p>
      </div>
      <aside className="summary-box">
        <h2>Campaign details</h2>
        <p>
          <Link to="./players">Players</Link>
        </p>
      </aside>
    </div>
  );
}
