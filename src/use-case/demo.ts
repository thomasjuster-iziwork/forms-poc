// to import from somewhere like an interface contract
type Gateway = {
  isOk: () => boolean;
};

type UseCaseParams<Input> = {
  gateway: Gateway;
  input: Input;
};
type UseCase<Input, Output> = (params: UseCaseParams<Input>) => Output;

export const makeUseCase = <
  Input,
  Fn extends UseCase<Input, any> = UseCase<Input, any>
>(
  useCase: Fn
) => <Presenter extends (output: ReturnType<Fn>) => any>(
  params: Parameters<Fn>[0] & { presenter: Presenter }
) => {
  return params.presenter(useCase(params));
};

// --
// --

// -- DEMO --

const gateway: Gateway = {
  isOk: () => true
};

// use-case/isTestOk.ts

type IsTestOkInput = {
  label: string;
};
const isTestOk = makeUseCase<IsTestOkInput>(({ gateway, input }) => {
  return { testIsOk: input.label.includes("toto") && gateway.isOk() };
});

console.info(
  "demo isTestOk():",
  isTestOk({
    input: { label: "toto" },
    gateway,
    presenter: ({ testIsOk }) => (testIsOk ? "yes" : "no")
  })
);
