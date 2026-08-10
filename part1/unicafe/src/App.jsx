import { useState } from 'react'

const Header = (props) => {
  const { text } = props
  return (<h1>{text}</h1>)
}

const Button = (props) => <button onClick={props.onClick}>{props.title}</button>

const StatisticLine = (props) => {
  const { text, value } = props
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistcs = (props) => {
  const { good, neutral, bad, all, avg, positive } = props
  if (good === 0 && neutral === 0 && bad == 0)
    return (<p>No feedback given</p>)

  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={avg} />
        <StatisticLine text='positive' value={positive} />
      </tbody>
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = (newValue) => {
    setGood(newValue)
  }
  const handleNeutral = (newValue) => {
    setNeutral(newValue)
  }
  const handleBad = (newValue) => {
    setBad(newValue)
  }

  const calcAll = () => (good + neutral + bad)

  const calcAverage = () => {
    const avg = (good + neutral * 0 + bad * -1) / calcAll()
    console.log("calling average", avg)
    if (isNaN(avg)) {
      return ("")
    }
    return avg
  }

  const calcPositive = () => {
    const positiveScore = good / calcAll()
    if (isNaN(positiveScore)) {
      return ("")
    }
    return (`${positiveScore * 100}%`)
  }


  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={() => handleGood(good + 1)} title='good'></Button>
      <Button onClick={() => handleNeutral(neutral + 1)} title='neutral'></Button>
      <Button onClick={() => handleBad(bad + 1)} title='bad'></Button>
      <Header text="statistics" />
      <Statistcs
        good={good}
        neutral={neutral}
        bad={bad}
        all={calcAll()}
        avg={calcAverage()}
        positive={calcPositive()}
      />
    </div>
  )
}

export default App