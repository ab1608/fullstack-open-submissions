const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => {
  const { part } = props
  return (
    <p key={part.id}>{part.name} {part.exercises}</p>
  )
}

const Content = (props) => {
  const { parts } = props
  return (
    <div>
      {parts.map(part =>
        <Part part={part} />)}
    </div>
  )
}


const Total = (props) => {
  const { parts } = props
  const courseTotal = parts.reduce((sum, part) => { return sum + part.exercises }, 0)

  return (<b><p>Total of exercises {courseTotal}</p></b>)
}

const Course = (props) => {
  const { course, parts } = props
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      {courses.map(course =>
        <Course course={course.name} parts={course.parts} />
      )}
    </div>
  )
}


export default App;