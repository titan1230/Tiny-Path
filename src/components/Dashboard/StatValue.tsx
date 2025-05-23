'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ValueComponent() {
  const { data, error, isLoading } = useSWR('/api/stats/users', fetcher, {
    refreshInterval: 5000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  if (isLoading) return <span className="loading loading-dots loading-xl"></span>  ;
  if (error) return <>Error</>;

  return <>{data?.value ?? 'N/A'}</>;
}
