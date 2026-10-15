import { ClientGreeting } from '@/components/client-greeting';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

 
const Page = () => {
  prefetch(
    trpc.hello.queryOptions({
      text: 'geneto',
    }),
  );
 
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
export default Page;