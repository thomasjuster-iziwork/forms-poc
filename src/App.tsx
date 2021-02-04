import React from "react"
import { MissionForm } from "./Mission/form"
import {
  StartDate,
  Duration,
  EndDate,
  Jobs,
  JobName,
  JobYears,
  Ssn,
} from "./Mission/fields"
import "./styles.css"
import "./forms/applyRules"
import "./use-case/demo"
import { usePromise } from "./hooks/use-promise"

export default function App() {
  const missionId = "some mission id here"
  const [initialValues] = usePromise(
    () => MissionForm.getInitialValues(missionId),
    [missionId]
  )
  const state = MissionForm.useForm(initialValues || MissionForm.defaultValues)

  return (
    <div className="App">
      <MissionForm.Provider value={state}>
        <button
          onClick={() => {
            console.info("validate", state.errors)
          }}
        >
          Validate
        </button>
        <div>
          <StartDate.Input />
        </div>
        <div>{!EndDate.isEditable(state.values) && <EndDate.Input />}</div>
        <Duration.Input />
        <div>
          <Ssn.Input />
        </div>
        <div>
          <Jobs.Input
            map={(_v, index) => (
              <div
                key={index}
                style={{ padding: 8, borderBottom: "1px solid #eee" }}
              >
                <h5 style={{ margin: 0 }}>Job {index}</h5>
                <JobName.Input index={index} />
                <JobYears.Input index={index} disabled={index > 1} />
              </div>
            )}
          />
        </div>
      </MissionForm.Provider>
    </div>
  )
}

// function divisors(toDivide, number = 2, acc = [1]) {
//   const max = Math.ceil(toDivide / 2);
//   if (number > max) {
//     return acc;
//   }
//   const isDivisor = toDivide % number === 0;
//   if (isDivisor) {
//     acc.push(number);
//   }
//   return divisors(toDivide, number + 1, acc);
// }
// const sum = (numbers) => numbers.reduce((acc, number) => acc + number, 0);
// const getBuddy = (n) => sum(divisors(n)) - 1;
// const areBuddy = (n, m) => getBuddy(n) === m && getBuddy(m) === n;

// function buddy(start, limit) {
//   for (let n = start; n <= limit; n++) {
//     const m = getBuddy(n);
//     if (areBuddy(n, m) && m > n) {
//       return [n, m];
//     }
//   }
//   return "Nothing";
// }

// console.info("buddy(23, 4669)", buddy(23, 4669));

// console.info(divisors(24), sum(divisors(24)));
// console.info(divisors(36));
