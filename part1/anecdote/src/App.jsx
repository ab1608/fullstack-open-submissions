import { useState } from 'react'

const Button = (props) => {
  const { text, onClick } = props
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)

  const voteMap = {}
  for (let i = 0; i < anecdotes.length; i++) { voteMap[i] = 0 }
  const [votes, setVotes] = useState(voteMap)

  const [popularNote, setPopularNote] = useState(0)

  const getRandomIndex = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  const nextAnectode = () => setSelected(getRandomIndex(0, anecdotes.length))

  const updateVotes = (selectedNote) => {
    const voteCopy = { ...votes }
    const prevVoteTotal = voteCopy[selectedNote]
    const newVoteTotal = prevVoteTotal + 1
    voteCopy[selectedNote] = newVoteTotal
    setVotes(voteCopy)

    const currentPopularvote = voteCopy[popularNote]
    if (newVoteTotal > currentPopularvote) {
      setPopularNote(selectedNote)
    }
  }


  return (
    <div>
      <h1>Anectode of the day</h1>
      {anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <div>
        <Button text="vote" onClick={() => updateVotes(selected)} />
        <Button text="next anecdote" onClick={nextAnectode} />
      </div>
      <h1>Anectode with the most votes</h1>
      {anecdotes[popularNote]}
    </div>
  )
}

export default App