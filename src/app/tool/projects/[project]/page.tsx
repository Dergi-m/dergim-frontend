'use client';

import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();

  console.log(params);

  return <div></div>;
}
