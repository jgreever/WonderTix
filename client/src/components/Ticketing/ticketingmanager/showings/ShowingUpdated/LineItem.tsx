import React from 'react';

interface itemProps {
  label: string;
  information: number | string;
  description?: boolean;
  event?: boolean;
}

export const LineItem = (props: itemProps) => {
  const {label, information, event, description} = props;
  const divClass = !event
    ? 'flex flex-row justify-between min-[768px]:grid min-[768px]:grid-cols-12 text-zinc-800'
    : 'grid grid-cols-12 gap-1 mb-4 text-zinc-800';
  const labelClass = !event
    ? 'text-sm font-semibold whitespace-nowrap  min-[768px]:col-span-6'
    : `text-sm font-semibold ${
      description ? 'col-span-12' : 'col-span-5 min-[450px]:col-span-12'
    }`;
  const informationClass = !event
    ? `text-sm pl-1 whitespace-nowrap min-[768px]:col-span-6`
    : `text-sm min-[450px]:text-md w-full rounded-lg ${
      description ? 'col-span-12' : 'col-span-7 min-[450px]:col-span-12'
    }`;
  return (
    <div className={divClass}>
      <p className={labelClass}>{label}: </p>
      <p className={informationClass}>{information}</p>
    </div>
  );
};