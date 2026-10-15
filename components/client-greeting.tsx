'use client';
 
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '../trpc/client';
 
export function ClientGreeting() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hello.queryOptions({
    text: 'geneto',
  }));
  return (
    <div>
      <h1>{data.greeting}</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}