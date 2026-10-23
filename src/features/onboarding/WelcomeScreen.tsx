import { useState } from 'react';
import { NicknameStep } from './NicknameStep';
import { PayStep } from './PayStep';

type Step = { n: 1 } | { n: 2; nickname: string };

/**
 * First launch (brief F16): a nickname, then a plan or pay per coffee, then Home. Nothing is saved until the
 * last step, so leaving halfway starts over cleanly.
 */
export function WelcomeScreen() {
  const [step, setStep] = useState<Step>({ n: 1 });
  const [draft, setDraft] = useState('');
  // Moving focus to the new step's title tells screen-reader users the step changed; not on first load.
  const [moved, setMoved] = useState(false);

  if (step.n === 1) {
    return (
      <NicknameStep
        key="nickname"
        value={draft}
        onChange={setDraft}
        focusTitle={moved}
        onNext={(nickname) => {
          setMoved(true);
          setStep({ n: 2, nickname });
        }}
      />
    );
  }
  return (
    <PayStep
      key="pay"
      nickname={step.nickname}
      onBack={() => {
        setMoved(true);
        setStep({ n: 1 });
      }}
    />
  );
}
