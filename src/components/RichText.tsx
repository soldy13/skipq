import { Fragment, type ReactNode } from 'react';

/**
 * Render a translated string whose {placeholders} are React nodes, e.g. the big number inside
 * "{free} of 30 free". Translate first with the plain vars; the remaining {names} are filled here.
 */
export function RichText({ text, nodes }: { text: string; nodes: Readonly<Record<string, ReactNode>> }) {
  const parts = text.split(/(\{\w+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const name = /^\{(\w+)\}$/.exec(part)?.[1];
        return <Fragment key={i}>{name && name in nodes ? nodes[name] : part}</Fragment>;
      })}
    </>
  );
}
