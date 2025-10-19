import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const changeAnecdote = () => setSelected(GetRandomInt(anecdotes.length));
  const incrementVote = (index) => {
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
  };

  return (
    <>
      <div>{anecdotes[selected]}</div>
      <p>has {votes[selected]} votes</p>
      <Button onClick={changeAnecdote} text="next anecdote" />
      <Button onClick={() => incrementVote(selected)} text="vote" />
      <h1>Anecdote with most votes</h1>
      <MostVotes
        index={votes.indexOf(Math.max(...votes))}
        arr={anecdotes}
        arr1={votes}
      />
    </>
  );
};

const MostVotes = ({ index, arr, arr1 }) => {
  if (arr1[index] === 0) {
    return <p>None</p>;
  } else {
    return (
      <>
        <p>{arr[index]}</p>
        <p>has {arr1[index]} votes</p>
      </>
    );
  }
};
const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const GetRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export default App;
