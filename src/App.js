import React, { useState } from "react";
import DateInput from "./inputs/DateInput";
import FloatInput from "./inputs/FloatInput";
import MissionForm from "./Mission/Form";
import {
  StartDate,
  Duration,
  EndDate,
  Jobs,
  JobName,
  JobYears,
  Ssn
} from "./Mission/fields";
import "./styles.css";
import "./forms/applyRules";
import "./use-case/demo";

export default function App() {
  const [number, setNumber] = useState(999);
  const [date, setDate] = useState(null);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <FloatInput value={number} onChange={setNumber} />
      <button onClick={() => setNumber(number + 1)}>Increment</button>
      <div>
        <output>{number || "null"}</output>
      </div>
      <div>
        <DateInput value={date} onChange={setDate} />
      </div>
      <div>
        <output>{date?.toLocaleString("fr-FR") || "null"}</output>
      </div>
      <hr />
      <div>
        <MissionForm>
          {({ values, validate }) => (
            <>
              <button
                onClick={() => {
                  console.info("validate", validate(values));
                }}
              >
                Validate
              </button>
              <div>
                <StartDate.Input />
              </div>
              <div>Date: {StartDate.display(values.startDate)}</div>
              <div>{!EndDate.canEdit(values) && <EndDate.Input />}</div>
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
            </>
          )}
        </MissionForm>
      </div>
    </div>
  );
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
